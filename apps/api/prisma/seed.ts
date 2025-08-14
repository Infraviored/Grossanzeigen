import 'dotenv/config';
import { PrismaClient, Role, ListingStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seller user
  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      passwordHash: 'argon2_placeholder',
      roles: [Role.USER, Role.SELLER],
      profile: {
        create: {
          displayName: 'Top Seller',
          avatarUrl: null,
          bio: 'I sell great stuff',
          addresses: [{ line1: '123 Main St', city: 'Berlin', country: 'DE' }],
        },
      },
    },
    include: { profile: true },
  });

  // Buyer user
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      passwordHash: 'argon2_placeholder',
      roles: [Role.USER],
      profile: {
        create: {
          displayName: 'Curious Buyer',
          avatarUrl: null,
          bio: 'Looking for deals',
        },
      },
    },
    include: { profile: true },
  });

  // Session for seller
  await prisma.session.upsert({
    where: { token: 'dev-seller-session' },
    update: {},
    create: {
      userId: seller.id,
      token: 'dev-seller-session',
      userAgent: 'seed-script',
      ipAddress: '127.0.0.1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  // Categories
  const rootCategory = await prisma.category.upsert({
    where: { id: 'root-category' },
    update: {},
    create: {
      id: 'root-category',
      name: 'Root',
    },
  });

  const electronics = await prisma.category.upsert({
    where: { id: 'cat-electronics' },
    update: {},
    create: {
      id: 'cat-electronics',
      parentId: rootCategory.id,
      name: 'Electronics',
      attributeSchema: {
        condition: { type: 'enum', values: ['new', 'used', 'refurbished'] },
        brand: { type: 'text' },
        color: { type: 'text' },
      },
    },
  });

  // Seed 1,200 listings around Berlin with simple attributes
  const totalListings = 1200;
  const categories = [
    electronics,
    await prisma.category.upsert({
      where: { id: 'cat-phones' },
      update: {},
      create: {
        id: 'cat-phones',
        parentId: electronics.id,
        name: 'Phones',
        attributeSchema: {
          condition: { type: 'enum', values: ['new', 'used', 'refurbished'] },
          brand: { type: 'text' },
          storage: { type: 'enum', values: ['64GB', '128GB', '256GB', '512GB'] },
        },
      },
    }),
    await prisma.category.upsert({
      where: { id: 'cat-computers' },
      update: {},
      create: {
        id: 'cat-computers',
        parentId: electronics.id,
        name: 'Computers',
        attributeSchema: {
          condition: { type: 'enum', values: ['new', 'used', 'refurbished'] },
          brand: { type: 'text' },
          ram: { type: 'enum', values: ['8GB', '16GB', '32GB'] },
        },
      },
    }),
  ];

  function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const sampleBrands = ['Apple', 'Samsung', 'Dell', 'Lenovo', 'Sony', 'HP', 'Asus', 'Google'];
  const sampleColors = ['Black', 'White', 'Blue', 'Silver', 'Gray', 'Green'];
  const sampleConditions = ['new', 'used', 'refurbished'];
  const sampleTitles = [
    'Great condition',
    'Like new',
    'Brand new sealed',
    'Well maintained',
    'Barely used',
    'Excellent deal',
  ];

  const batchSize = 50;
  for (let i = 0; i < totalListings; i += batchSize) {
    const ops: Promise<any>[] = [];
    for (let j = 0; j < batchSize && i + j < totalListings; j++) {
      const category = pick(categories);
      const brand = pick(sampleBrands);
      const color = pick(sampleColors);
      const condition = pick(sampleConditions);
      const price = Math.floor(randomInRange(20, 2000)) * 100;
      const lat = new Prisma.Decimal(randomInRange(52.35, 52.65).toFixed(6));
      const lon = new Prisma.Decimal(randomInRange(13.20, 13.55).toFixed(6));
      const title = `${brand} ${pick(['Phone', 'Laptop', 'Headphones', 'Monitor'])} — ${pick(sampleTitles)}`;

      ops.push(
        prisma.listing
          .create({
            data: {
              sellerId: seller.id,
              categoryId: category.id,
              title,
              description: `${title}. ${condition} ${color}. Includes charger.`,
              price,
              currency: 'EUR',
              status: ListingStatus.ACTIVE,
              latitude: lat,
              longitude: lon,
              locationText: 'Berlin, DE',
              attributes: { condition, brand, color },
              images: {
                create: [
                  {
                    orderIndex: 0,
                    s3KeyOriginal: `seed/${brand.toLowerCase()}_${i + j}.jpg`,
                    variants: {
                      thumb: `https://example-cdn/seed/${brand.toLowerCase()}_${i + j}_thumb.jpg`,
                      medium: `https://example-cdn/seed/${brand.toLowerCase()}_${i + j}_medium.jpg`,
                      large: `https://example-cdn/seed/${brand.toLowerCase()}_${i + j}_large.jpg`,
                    },
                  },
                ],
              },
            },
          })
          .then((created) =>
            prisma.searchOutbox.create({
              data: {
                eventType: 'listing.created',
                entityType: 'listing',
                entityId: created.id,
                payload: {
                  id: created.id,
                  title: created.title,
                  description: created.description,
                  categoryId: created.categoryId,
                  price: created.price,
                  currency: created.currency,
                  status: created.status,
                  location: { lat: created.latitude, lon: created.longitude },
                  attributes: created.attributes,
                  createdAt: created.createdAt,
                },
              },
            }),
          ),
      );
    }
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(ops);
    // eslint-disable-next-line no-console
    console.log(`Inserted ${Math.min(i + batchSize, totalListings)} listings...`);
  }

  // Conversation & message
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: seller.id },
          { userId: buyer.id },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: buyer.id,
      text: 'Hi! Is this still available?',
      receipts: {
        create: [
          { userId: seller.id, readAt: null },
          { userId: buyer.id, readAt: new Date() },
        ],
      },
    },
  });

  // Social: favorite a random recent listing for buyer
  const anyListing = await prisma.listing.findFirst({ orderBy: { createdAt: 'desc' } });
  if (anyListing) {
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId: buyer.id, listingId: anyListing.id } },
      update: {},
      create: { userId: buyer.id, listingId: anyListing.id },
    });

    // Step 6 — Orders & payments: create an order for the recent listing and move through states
    const existingOrder = await prisma.order.findUnique({ where: { listingId: anyListing.id } });
    let order = existingOrder;
    if (!order) {
      order = await prisma.order.create({
        data: {
          buyerId: buyer.id,
          sellerId: seller.id,
          listingId: anyListing.id,
          amountTotal: anyListing.price,
          currency: anyListing.currency,
          state: 'CREATED',
          timeline: [{ state: 'CREATED', at: new Date().toISOString() }],
        },
      });
    }

    // Attach a stub payment and progress the order
    const payment = await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {},
      create: {
        orderId: order.id,
        stripePaymentIntentId: 'pi_seed_intent',
        status: 'requires_confirmation',
        fees: Math.floor(order.amountTotal * 0.03),
      },
    });

    // Move order through states to COMPLETED with a simple timeline
    const states = ['PAID', 'FULFILLED', 'COMPLETED'] as const;
    for (const s of states) {
      const fresh = await prisma.order.findUnique({ where: { id: order.id } });
      const timeline = Array.isArray(fresh?.timeline) ? (fresh!.timeline as any[]) : [];
      timeline.push({ state: s, at: new Date().toISOString() });
      order = await prisma.order.update({ where: { id: order.id }, data: { state: s as any, timeline } });
    }

    // Step 7 — Saved search for buyer
    const seedSavedSearchId = 'seed-buyer-savedsearch';
    await prisma.savedSearch.upsert({
      where: { id: seedSavedSearchId },
      update: {},
      create: {
        id: seedSavedSearchId,
        userId: buyer.id,
        params: { text: 'iphone', categoryId: 'cat-phones', priceMax: 100000 },
        notify: true,
      },
    });

    // Step 8 — Notification example
    await prisma.notification.create({
      data: {
        userId: buyer.id,
        type: 'order.update',
        payload: { orderId: order.id, state: order.state },
      },
    });

    // Step 9 — Moderation example (report + flag)
    await prisma.report.create({
      data: {
        reporterId: buyer.id,
        subjectType: 'listing',
        subjectId: anyListing.id,
        reason: 'test-seed-report',
        status: 'open',
      },
    });
    await prisma.moderationFlag.create({
      data: {
        subjectType: 'listing',
        subjectId: anyListing.id,
        reason: 'seed-flag',
        status: 'pending',
      },
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


