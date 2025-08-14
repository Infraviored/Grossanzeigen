import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { PoliciesModule } from './policies/policies.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MeModule } from './me/me.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ListingsModule } from './listings/listings.module.js';
import { ModerationModule } from './moderation/moderation.module.js';
import { DisputesModule } from './disputes/disputes.module.js';
import { PrivacyModule } from './privacy/privacy.module.js';
import { ImagesModule } from './images/images.module.js';
import { MessagingModule } from './messaging/messaging.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { SearchEventsModule } from './search-events/search-events.module.js';
import { AlertsModule } from './alerts/alerts.module.js';

@Module({
  imports: [HealthModule, PoliciesModule, PrismaModule, AuthModule, MeModule, UsersModule, CategoriesModule, ListingsModule, ModerationModule, DisputesModule, PrivacyModule, ImagesModule, MessagingModule, NotificationsModule, OrdersModule, SearchEventsModule, AlertsModule],
})
export class AppModule {}


