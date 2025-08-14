import 'dotenv/config';
import { Client } from '@opensearch-project/opensearch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
  const username = process.env.OPENSEARCH_USERNAME || 'admin';
  const password = process.env.OPENSEARCH_PASSWORD || '';
  const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

  const index = 'sellers';
  const users = await prisma.user.findMany({ where: { roles: { has: 'SELLER' } }, include: { profile: true } });
  const body: any[] = [];
  for (const u of users) {
    body.push({ index: { _index: index, _id: u.id } });
    body.push({ id: u.id, display_name: u.profile?.displayName ?? u.email, created_at: u.createdAt });
  }
  if (body.length > 0) {
    await client.bulk({ refresh: true as any, body });
  }

  await prisma.$disconnect();
  // eslint-disable-next-line no-console
  console.log(`Reindexed ${users.length} sellers`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


