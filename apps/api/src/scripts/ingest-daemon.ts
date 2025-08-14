import 'dotenv/config';
import { Client } from '@opensearch-project/opensearch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function cycleOnce(client: Client, batchSize = 200) {
  const events = await prisma.searchOutbox.findMany({
    where: { processedAt: null },
    orderBy: { createdAt: 'asc' },
    take: batchSize,
  });
  if (events.length === 0) return 0;
  for (const evt of events) {
    try {
      if (evt.eventType === 'listing.deleted') {
        await removeListing(client, evt.entityId);
      } else if (evt.eventType?.startsWith('listing.')) {
        await upsertListing(client, evt.payload as any);
      }
      await prisma.searchOutbox.update({ where: { id: evt.id }, data: { processedAt: new Date() } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed processing outbox event', evt.id, err);
    }
  }
  return events.length;
}

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || '';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

  // eslint-disable-next-line no-console
  console.log('Starting ingest daemon...');
  while (true) {
    const n = await cycleOnce(client, 200);
    if (n > 0) {
      // eslint-disable-next-line no-console
      console.log(`Processed ${n} events`);
      continue;
    }
    await sleep(2000);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


