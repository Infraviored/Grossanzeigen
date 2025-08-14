export type UUID = string;

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export * from './models/user';
export * from './models/category';
export * from './models/listing';
export * from './models/messaging';
export * from './models/order';
export * from './models/payment';
export * from './models/notifications';

