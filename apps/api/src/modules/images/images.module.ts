import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ImageModerationService } from '../moderation/image.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ImagesController],
  providers: [ImageModerationService],
})
export class ImagesModule {}


