import { Controller, Get } from '@nestjs/common';

@Controller('docs')
export class DocsController {
  @Get('json')
  getOpenApiJson() {
    // Placeholder: integrate Nest Swagger later; return minimal doc stub to unblock SDK generation
    return {
      openapi: '3.0.0',
      info: { title: 'Grossanzeigen API', version: '0.1.0' },
      paths: {},
    };
  }
}


