import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ImagesController],
})
export class ImagesModule {}


