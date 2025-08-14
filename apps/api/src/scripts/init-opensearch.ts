import 'dotenv/config';
import { Client } from '@opensearch-project/opensearch';

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || 'SoK0D_9L7r#bJ1!mQaZ2&xP5^Ve3@Uc';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });
  const forceRecreate = process.env.FORCE_RECREATE === '1';

  async function ensureIndex(indexName: string, body: any) {
    const exists = await client.indices.exists({ index: indexName });
    if (exists.body && forceRecreate) {
      await client.indices.delete({ index: indexName });
    }
    const existsAfter = await client.indices.exists({ index: indexName });
    if (!existsAfter.body) {
      await client.indices.create({ index: indexName, body });
      // eslint-disable-next-line no-console
      console.log(`Created ${indexName} index`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${indexName} index already exists`);
    }
  }

  // Listings index with n-grams and synonyms for search
  const listingsIndex = 'listings';
  await ensureIndex(listingsIndex, {
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 0,
        max_ngram_diff: 10
      },
      analysis: {
        filter: {
          synonyms_en: {
            type: 'synonym_graph',
            synonyms: [
              'phone, smartphone',
              'tv, television',
              'laptop, notebook',
              'earbuds, earphones, headphones'
            ]
          }
        },
        analyzer: {
          default: { type: 'standard' },
          title_ngram: {
            type: 'custom',
            tokenizer: 'ngram_tokenizer',
            filter: ['lowercase']
          },
          title_synonyms: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'synonyms_en']
          }
        },
        tokenizer: {
          ngram_tokenizer: {
            type: 'ngram',
            min_gram: 2,
            max_gram: 12,
            token_chars: ['letter', 'digit']
          }
        }
      }
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
        attributes: { type: 'object', enabled: true }
      }
    }
  });

  // Sellers index (basic)
  const sellersIndex = 'sellers';
  await ensureIndex(sellersIndex, {
    settings: {
      index: { number_of_shards: 1, number_of_replicas: 0, max_ngram_diff: 10 },
      analysis: {
        analyzer: {
          default: { type: 'standard' },
          name_ngram: {
            type: 'custom',
            tokenizer: 'ngram_tokenizer',
            filter: ['lowercase']
          }
        },
        tokenizer: {
          ngram_tokenizer: {
            type: 'ngram',
            min_gram: 2,
            max_gram: 12,
            token_chars: ['letter', 'digit']
          }
        }
      }
    },
    mappings: {
      properties: {
        id: { type: 'keyword' },
        display_name: { type: 'text', analyzer: 'name_ngram' },
        created_at: { type: 'date' }
      }
    }
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


