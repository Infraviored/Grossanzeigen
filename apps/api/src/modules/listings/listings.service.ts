import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

type CreateListingInput = {
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  attributes?: Record<string, unknown>;
  latitude?: number | null;
  longitude?: number | null;
  locationText?: string | null;
};

type UpdateListingInput = Partial<CreateListingInput> & {
  id: string;
};

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureSellerOwns(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId }, select: { sellerId: true, status: true } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your listing');
    return listing.status;
  }

  private async validateAttributes(categoryId: string, attributes?: Record<string, unknown>) {
    if (!attributes) return;
    const category = await this.prisma.category.findUnique({ where: { id: categoryId }, select: { attributeSchema: true } });
    const schema = (category?.attributeSchema ?? {}) as Record<string, any>;
    for (const key of Object.keys(attributes)) {
      if (!(key in schema)) throw new BadRequestException(`Unknown attribute: ${key}`);
    }
    for (const [key, spec] of Object.entries(schema)) {
      if (spec?.type === 'enum' && attributes?.[key] != null) {
        const allowed: any[] = spec.values ?? [];
        if (!allowed.includes(attributes[key])) throw new BadRequestException(`Invalid value for ${key}`);
      }
    }
  }

  async create(userId: string, input: CreateListingInput) {
    await this.validateAttributes(input.categoryId, input.attributes);
    const created = await this.prisma.listing.create({
      data: {
        sellerId: userId,
        categoryId: input.categoryId,
        title: input.title,
        description: input.description,
        price: input.price,
        currency: input.currency,
        status: 'DRAFT' as any,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        locationText: input.locationText ?? null,
         attributes: (input.attributes as any) ?? undefined,
      },
      select: { id: true },
    });
    await this.enqueueSearchEvent('listing.created', created.id);
    return await this.getById(created.id);
  }

  async update(userId: string, input: UpdateListingInput) {
    const status = await this.ensureSellerOwns(userId, input.id);
    if (status !== 'DRAFT' && status !== 'ACTIVE') throw new BadRequestException('Cannot update listing in this state');
    if (input.categoryId && input.attributes) await this.validateAttributes(input.categoryId, input.attributes);
    const updated = await this.prisma.listing.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        price: input.price as any,
        currency: input.currency,
        categoryId: input.categoryId,
         attributes: (input.attributes as any) ?? undefined,
        latitude: (input.latitude ?? undefined) as any,
        longitude: (input.longitude ?? undefined) as any,
        locationText: input.locationText,
      },
      select: { id: true },
    });
    await this.enqueueSearchEvent('listing.updated', updated.id);
    return await this.getById(updated.id);
  }

  async publish(userId: string, id: string) {
    // VerifiedUserGuard is applied at controller level; double-check here for defense-in-depth
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { emailVerifiedAt: true } });
    if (!user?.emailVerifiedAt) {
      throw new ForbiddenException('Email not verified');
    }
    // Block publish if any attached image is flagged by moderation
    const images = await this.prisma.listingImage.findMany({ where: { listingId: id }, select: { s3KeyOriginal: true } });
    if (images.length > 0) {
      const keys = images.map((i) => i.s3KeyOriginal);
      const flagged = await this.prisma.moderationFlag.findFirst({ where: { subjectType: 'image', subjectId: { in: keys }, status: 'OPEN' } as any });
      if (flagged) {
        throw new ForbiddenException('Listing has flagged images');
      }
    }
    const status = await this.ensureSellerOwns(userId, id);
    if (status !== 'DRAFT') throw new BadRequestException('Only draft can be published');
    await this.prisma.listing.update({ where: { id }, data: { status: 'ACTIVE' as any } });
    await this.enqueueSearchEvent('listing.updated', id);
    return await this.getById(id);
  }

  async unpublish(userId: string, id: string) {
    const status = await this.ensureSellerOwns(userId, id);
    if (status !== 'ACTIVE') throw new BadRequestException('Only active can be unpublished');
    await this.prisma.listing.update({ where: { id }, data: { status: 'DRAFT' as any } });
    await this.enqueueSearchEvent('listing.updated', id);
    return await this.getById(id);
  }

  async remove(userId: string, id: string) {
    await this.ensureSellerOwns(userId, id);
    await this.prisma.listing.delete({ where: { id } });
    await this.enqueueSearchEvent('listing.deleted', id);
    return { success: true } as const;
  }

  async getById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return { listing };
  }

  async list(params: {
    sellerId?: string;
    categoryId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    text?: string;
    cursor?: string;
    limit?: number;
  }) {
    const where: Prisma.ListingWhereInput = {};
    if (params.sellerId) where.sellerId = params.sellerId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.status) where.status = params.status as any;
    if (params.minPrice != null || params.maxPrice != null) {
      where.price = {};
      if (params.minPrice != null) (where.price as Prisma.IntFilter).gte = params.minPrice;
      if (params.maxPrice != null) (where.price as Prisma.IntFilter).lte = params.maxPrice;
    }
    if (params.text) {
      where.OR = [
        { title: { contains: params.text, mode: 'insensitive' } },
        { description: { contains: params.text, mode: 'insensitive' } },
      ];
    }
    const take = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const listings = await this.prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      cursor: params.cursor ? { id: params.cursor } : undefined,
      include: { images: true },
    });
    const nextCursor = listings.length > take ? listings.pop()!.id : null;
    return { listings, nextCursor };
  }

  private async enqueueSearchEvent(eventType: string, listingId: string) {
    // Step 10 compatibility: write to SearchOutbox
     await this.prisma.searchOutbox.create({
      data: {
        eventType,
        entityType: 'listing',
        entityId: listingId,
         payload: undefined,
      },
    });
  }
}


