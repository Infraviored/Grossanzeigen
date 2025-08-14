import { Module } from '@nestjs/common';
import { SearchEventsController } from './search-events.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SearchEventsController],
})
export class SearchEventsModule {}


