// health-check.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { WatcherService } from './watcher.service';

@Controller('health')
export class WatcherController {
  constructor(private readonly watcherService: WatcherService) {}

  @Get()
  async checkHealth(@Query('url') url: string): Promise<string> {
    await this.watcherService.checkDomain(url);
    return 'Health checked successfully';
  }
}
