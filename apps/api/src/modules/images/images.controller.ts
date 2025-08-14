import { Body, Controller, Post, UseGuards, BadRequestException, Delete, Param, ForbiddenException } from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { ImageModerationService } from '../moderation/image.service.js';

class PresignDto {
  mimeType!: string;
  maxSize?: number;
}

class AttachImageDto {
  key!: string;
  orderIndex!: number;
}

class ReorderImageDto {
  id!: string;
  orderIndex!: number;
}

class ReorderDto {
  listingId!: string;
  order!: ReorderImageDto[];
}

@Controller('images')
export class ImagesController {
  constructor(private readonly prisma: PrismaService, private readonly imageMod: ImageModerationService) {}

  @UseGuards(SessionAuthGuard)
  @Post('presign')
  async presign(@Body() dto: PresignDto) {
    // Placeholder presign response — integrate with S3/Minio in Agent 3/Step 7
    const key = `uploads/${crypto.randomUUID()}`;
    const uploadUrl = `http://minio.local/upload/${encodeURIComponent(key)}`;
    return { uploadUrl, key, maxSize: dto.maxSize ?? 10 * 1024 * 1024, mimeTypes: [dto.mimeType] };
  }

  private async moderateImagePlaceholder(key: string): Promise<{ blocked: boolean; reason?: string }> {
    return await this.imageMod.checkByStorageKey(key);
  }

  @UseGuards(SessionAuthGuard)
  @Post('attach')
  async attach(@Body() dto: AttachImageDto & { listingId: string }) {
    const moderation = await this.moderateImagePlaceholder(dto.key);
    if (moderation.blocked) {
      await this.prisma.moderationFlag.create({ data: { subjectType: 'image', subjectId: dto.key, reason: moderation.reason ?? 'blocked', status: 'OPEN' } });
      throw new BadRequestException('Image failed moderation');
    }
    const created = await this.prisma.listingImage.create({
      data: {
        listingId: dto.listingId,
        orderIndex: dto.orderIndex,
        s3KeyOriginal: dto.key,
      },
      select: { id: true, listingId: true, orderIndex: true, s3KeyOriginal: true },
    });
    return { image: created };
  }

  @UseGuards(SessionAuthGuard)
  @Post('reorder')
  async reorder(@Body() dto: ReorderDto, req: any) {
    const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId }, select: { sellerId: true } });
    if (!listing || listing.sellerId !== req.user.userId) throw new ForbiddenException('Not your listing');
    await this.prisma.$transaction(
      dto.order.map((o) =>
        this.prisma.listingImage.update({ where: { id: o.id }, data: { orderIndex: o.orderIndex } }),
      ),
    );
    return { success: true } as const;
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, req: any) {
    const img = await this.prisma.listingImage.findUnique({ where: { id }, select: { id: true, listingId: true, orderIndex: true, listing: { select: { sellerId: true } } } as any });
    if (!img) throw new BadRequestException('Image not found');
    if (img.listing.sellerId !== req.user.userId) throw new ForbiddenException('Not your listing');
    await this.prisma.listingImage.delete({ where: { id } });
    const remaining = await this.prisma.listingImage.findMany({ where: { listingId: img.listingId }, select: { id: true }, orderBy: { orderIndex: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((r, idx) => this.prisma.listingImage.update({ where: { id: r.id }, data: { orderIndex: idx } })),
    );
    return { success: true } as const;
  }
}


