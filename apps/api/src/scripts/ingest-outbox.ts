import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

const prisma = new PrismaClient();

async function upsertListing(client: Client, payload: any) {
  await client.index({
    index: 'listings',
    id: payload.id,
    body: {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      category_id: payload.categoryId,
      price: payload.price,
      currency: payload.currency,
      condition: payload.attributes?.condition,
      location: payload.location,
      created_at: payload.createdAt,
      attributes: payload.attributes,
    },
    refresh: false,
  });
}

async function removeListing(client: Client, id: string) {
  await client.delete({ index: 'listings', id }).catch(() => undefined);
}

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || 'SoK0D_9L7r#bJ1!mQaZ2&xP5^Ve3@Uc';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

  // Simple loop: fetch unprocessed events in small batches and process them
  const batchSize = 200;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const events = await prisma.searchOutbox.findMany({
      where: { processedAt: null },
      orderBy: { createdAt: 'asc' },
      take: batchSize,
    });
    if (events.length === 0) break;

    for (const evt of events) {
      try {
        if (evt.eventType === 'listing.deleted') {
          await removeListing(client, evt.entityId);
        } else {
          await upsertListing(client, evt.payload as any);
        }
        await prisma.searchOutbox.update({ where: { id: evt.id }, data: { processedAt: new Date() } });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed processing outbox event', evt.id, err);
      }
    }
    // eslint-disable-next-line no-console
    console.log(`Processed ${events.length} events...`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


