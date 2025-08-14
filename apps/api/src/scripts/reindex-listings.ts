import 'dotenv/config';
import { Client } from '@opensearch-project/opensearch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || '';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

  const targetVersion = process.env.LISTINGS_VERSION || 'v2';
  const base = 'listings';
  const newIndex = `${base}_${targetVersion}`;

  // Create target index using current settings from init script
  const initBody = {
    settings: {
      index: { number_of_shards: 1, number_of_replicas: 0, max_ngram_diff: 10 },
      analysis: {
        filter: {
          synonyms_en: {
            type: 'synonym_graph',
            synonyms: ['phone, smartphone', 'tv, television', 'laptop, notebook', 'earbuds, earphones, headphones'],
          },
        },
        analyzer: {
          default: { type: 'standard' },
          title_ngram: { type: 'custom', tokenizer: 'ngram_tokenizer', filter: ['lowercase'] },
          title_synonyms: { type: 'custom', tokenizer: 'standard', filter: ['lowercase', 'synonyms_en'] },
        },
        tokenizer: { ngram_tokenizer: { type: 'ngram', min_gram: 2, max_gram: 12, token_chars: ['letter', 'digit'] } },
      },
    },
    mappings: {
      properties: {
        id: { type: 'keyword' },
        title: { type: 'text', analyzer: 'title_ngram', search_analyzer: 'title_synonyms' },
        description: { type: 'text' },
        category_id: { type: 'keyword' },
        price: { type: 'long' },
        currency: { type: 'keyword' },
        condition: { type: 'keyword' },
        location: { type: 'geo_point' },
        created_at: { type: 'date' },
        attributes: { type: 'object', enabled: true },
      },
    },
  } as const;

  const exists = await client.indices.exists({ index: newIndex });
  if (!exists.body) {
    await client.indices.create({ index: newIndex, body: initBody });
  }

  // Stream listings from DB and bulk index
  const pageSize = 500;
  let lastId: string | null = null;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const listings: any[] = await prisma.listing.findMany({
      take: pageSize,
      ...(lastId ? { skip: 1, cursor: { id: lastId } } : {}),
      orderBy: { id: 'asc' },
      include: { images: true },
    });
    if (listings.length === 0) break;

    const body: any[] = [];
    for (const l of listings) {
      body.push({ index: { _index: newIndex, _id: l.id } });
      body.push({
        id: l.id,
        title: l.title,
        description: l.description,
        category_id: l.categoryId,
        price: l.price,
        currency: l.currency,
        condition: (l.attributes as any)?.condition,
        location: l.latitude && l.longitude ? { lat: Number(l.latitude), lon: Number(l.longitude) } : undefined,
        created_at: l.createdAt,
        attributes: l.attributes,
      });
    }

    await client.bulk({ refresh: false as any, body });
    lastId = listings[listings.length - 1].id;
    // eslint-disable-next-line no-console
    console.log(`Indexed ${lastId}`);
  }

  // Swap alias
  const alias = base;
  const current = await client.indices.getAlias({ index: `${base}*`, name: alias }).catch(() => ({ body: {} } as any));
  const actions: any[] = [];
  for (const indexName of Object.keys(current.body || {})) {
    actions.push({ remove: { index: indexName, alias } });
  }
  actions.push({ add: { index: newIndex, alias } });
  await client.indices.updateAliases({ body: { actions } });

  await prisma.$disconnect();
  // eslint-disable-next-line no-console
  console.log(`Reindexed to ${newIndex} and aliased as ${alias}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


