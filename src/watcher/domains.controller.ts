import { Controller, Get, Param } from '@nestjs/common';
import { WatcherService } from './watcher.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckerService: WatcherService) {}

  @Get(':url')
  async checkWatcher(@Param('url') url: string): Promise<string> {
    await this.healthCheckerService.checkDomain(url);
    return 'Watcher checked successfully';
  }
}
