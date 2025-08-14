import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageModerationService {
  async checkByStorageKey(_key: string): Promise<{ blocked: boolean; reason?: string }> {
    // TODO: integrate real provider (e.g., AWS Rekognition/Google Vision) later
    return { blocked: false };
  }
}


