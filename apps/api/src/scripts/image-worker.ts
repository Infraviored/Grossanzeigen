import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// NOTE: This worker is a scaffold. It expects S3 access (MinIO) and sharp to be installed.
// Install when workspace npm is fixed: npm i sharp @aws-sdk/client-s3

async function main() {
  const prisma = new PrismaClient();
  // Find images without variants (placeholder condition: variants null)
  const batch = await prisma.listingImage.findMany({ where: { variants: { equals: null } as any }, take: 50 });
  if (batch.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No images to process');
    await prisma.$disconnect();
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`Found ${batch.length} images to process (scaffold)`);

  // Intentionally skipping actual S3/sharp code until deps are available.
  // Mark as processed with dummy URLs to unblock flows.
  for (const img of batch) {
    await prisma.listingImage.update({
      where: { id: img.id },
      data: {
        variants: {
          thumb: `https://cdn.local/${img.s3KeyOriginal}?v=thumb`,
          medium: `https://cdn.local/${img.s3KeyOriginal}?v=medium`,
          large: `https://cdn.local/${img.s3KeyOriginal}?v=large`,
        },
      },
    });
    // Emit outbox for search refresh if needed
    const listing = await prisma.listing.findUnique({ where: { id: img.listingId } });
    if (listing) {
      await prisma.searchOutbox.create({
        data: {
          eventType: 'listing.updated',
          entityType: 'listing',
          entityId: listing.id,
          payload: {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            categoryId: listing.categoryId,
            price: listing.price,
            currency: listing.currency,
            status: listing.status,
            location: { lat: listing.latitude, lon: listing.longitude },
            attributes: listing.attributes,
            createdAt: listing.createdAt,
          },
        },
      });
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


