import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { Domain } from './watcher/domain.entity';
import { DomainModule } from './watcher/domain.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [Domain],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DomainModule,
  ],
})
export class AppModule {}
