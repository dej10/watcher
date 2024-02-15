import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateDomainDto } from './dto/create-domain.dto';
import { Repository } from 'typeorm';
import { Domain } from './domain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  domains,
  consecutiveFailureThreshold as thresholds,
} from './ping.json';

@Injectable()
export class WatcherService {
  private readonly consecutiveFailures: Map<string, number> = new Map();
  private readonly totalAttempts: Map<string, number> = new Map();
  private consecutiveFailureThreshold: number[];

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {
    this.consecutiveFailureThreshold = thresholds;
  }

  async create(createDomainDto: CreateDomainDto): Promise<Domain> {
    const domain = this.domainRepository.create(createDomainDto);
    return await this.domainRepository.save(domain);
  }

  async findAll(): Promise<Domain[]> {
    return await this.domainRepository.find();
  }

  async checkDomain(url: string): Promise<void> {
    const start = Date.now();
    let statusCode = null;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'check-watcher': 'true' },
      });

      statusCode = res.status;
      if (statusCode !== 200) {
        this.updateFailureCount(url);
      } else {
        this.resetFailureCount(url);
      }
    } catch (error) {
      console.error('Failed to check watcher:', error.message);
      this.updateFailureCount(url);
      statusCode = error.response ? error.response.status : 500;
    }

    const end = Date.now();
    const speed = end - start;

    await this.create({ url, statusCode, speed, date: Date.now() });

    const consecutiveFailures = this.consecutiveFailures.get(url) || 0;
    const thresholds = this.consecutiveFailureThreshold;

    for (const threshold of thresholds) {
      if (consecutiveFailures === threshold) {
        console.log(
          `Alert after ${threshold} consecutive failed attempts for ${url}`,
        );
      }
    }
  }

  private updateFailureCount(url: string): void {
    const count = this.consecutiveFailures.get(url) || 0;
    this.consecutiveFailures.set(url, count + 1);
    this.totalAttempts.set(url, (this.totalAttempts.get(url) || 0) + 1);
  }

  private resetFailureCount(url: string): void {
    this.consecutiveFailures.set(url, 0);
    this.totalAttempts.set(url, (this.totalAttempts.get(url) || 0) + 1);
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'watcher-watch',
  })
  private async checkDomainsFromFile(): Promise<void> {
    try {
      for (const domain of domains) {
        console.log(domain);
        await this.checkDomain(domain);
      }
    } catch (error) {
      console.error('CRON_ERROR', error.message);
    }
  }
}
