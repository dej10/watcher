import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Domain])],
  controllers: [WatcherController],
  providers: [WatcherService],
})
export class DomainModule {}
