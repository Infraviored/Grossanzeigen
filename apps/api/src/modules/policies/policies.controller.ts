import { Controller, Get, Header } from '@nestjs/common';
import { PoliciesService } from './policies.service.js';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get('terms')
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  getTerms() {
    return this.policiesService.getTermsOfService();
  }

  @Get('privacy')
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  getPrivacy() {
    return this.policiesService.getPrivacyPolicy();
  }

  @Get('prohibited-items')
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  getProhibitedItems() {
    return this.policiesService.getProhibitedItems();
  }

  @Get('community-guidelines')
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  getCommunityGuidelines() {
    return this.policiesService.getCommunityGuidelines();
  }
}


