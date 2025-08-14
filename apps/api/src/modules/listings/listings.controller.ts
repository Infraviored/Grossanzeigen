import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ListingsService } from './listings.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { VerifiedUserGuard } from '../auth/verified.guard.js';
// Temporarily disable rate limit guard binding to unblock boot
// import { RateLimitGuard } from '../ratelimit/ratelimit.guard.js';

class CreateListingDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() description!: string;
  @IsInt() @Min(0) price!: number;
  @IsString() @IsNotEmpty() currency!: string;
  @IsUUID() categoryId!: string;
  @IsOptional() attributes?: Record<string, unknown>;
  @IsOptional() @IsNumber() latitude?: number | null;
  @IsOptional() @IsNumber() longitude?: number | null;
  @IsOptional() @IsString() locationText?: string | null;
}

class UpdateListingDto {
  @IsUUID() id!: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) price?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() attributes?: Record<string, unknown>;
  @IsOptional() @IsNumber() latitude?: number | null;
  @IsOptional() @IsNumber() longitude?: number | null;
  @IsOptional() @IsString() locationText?: string | null;
}

@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.listings.getById(id);
  }

  @Get()
  async list(
    @Query('sellerId') sellerId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('text') text?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listings.list({
      sellerId,
      categoryId,
      status,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      text,
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @UseGuards(SessionAuthGuard)
  @Post()
  async create(@Body() dto: CreateListingDto, req: any) {
    return this.listings.create(req.user.userId, dto);
  }

  @UseGuards(SessionAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateListingDto>, req: any) {
    return this.listings.update(req.user.userId, { ...dto, id });
  }

  @UseGuards(SessionAuthGuard, VerifiedUserGuard)
  @Post(':id/publish')
  async publish(@Param('id') id: string, req: any) {
    return this.listings.publish(req.user.userId, id);
  }

  @UseGuards(SessionAuthGuard)
  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string, req: any) {
    return this.listings.unpublish(req.user.userId, id);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, req: any) {
    return this.listings.remove(req.user.userId, id);
  }
}


