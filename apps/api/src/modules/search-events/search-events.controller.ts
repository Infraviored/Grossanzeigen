import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';

@Controller('search/index')
export class SearchEventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('replay')
  async replay() {
    const pending = await this.prisma.searchOutbox.findMany({ where: { processedAt: null }, take: 1000 });
    const os = new OpenSearchClient({ node: process.env.OPENSEARCH_URL ?? 'http://localhost:9200' });
    // Placeholder: bulk index listings only
    for (const ev of pending) {
      if (ev.entityType !== 'listing') continue;
      const listing = await this.prisma.listing.findUnique({ where: { id: ev.entityId } });
      if (!listing) continue;
      await os.index({ index: 'listings', id: listing.id, document: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        category_id: listing.categoryId,
        price: listing.price,
        currency: listing.currency,
        condition: listing.status,
        location: listing.latitude && listing.longitude ? { lat: Number(listing.latitude), lon: Number(listing.longitude) } : undefined,
        created_at: listing.createdAt,
        attributes: listing.attributes ?? {},
      } as any, refresh: true });
      await this.prisma.searchOutbox.update({ where: { id: ev.id }, data: { processedAt: new Date() } });
    }
    return { processed: pending.length };
  }
}


