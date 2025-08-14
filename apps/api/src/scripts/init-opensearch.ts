import 'dotenv/config';
import { Client } from '@opensearch-project/opensearch';

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || 'SoK0D_9L7r#bJ1!mQaZ2&xP5^Ve3@Uc';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

  const listingsIndex = 'listings';
  const exists = await client.indices.exists({ index: listingsIndex });
  if (!exists.body) {
    await client.indices.create({
      index: listingsIndex,
      body: {
        settings: {
          index: {
            number_of_shards: 1,
            number_of_replicas: 0,
            max_ngram_diff: 10
          },
          analysis: {
            analyzer: {
              default: { type: 'standard' },
              title_ngram: {
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
            title: { type: 'text', analyzer: 'title_ngram' },
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
      }
    });
    // eslint-disable-next-line no-console
    console.log('Created listings index');
  } else {
    // eslint-disable-next-line no-console
    console.log('Listings index already exists');
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


