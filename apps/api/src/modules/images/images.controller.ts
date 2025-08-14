import { Body, Controller, Post, UseGuards, BadRequestException } from '@nestjs/common';
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
}


