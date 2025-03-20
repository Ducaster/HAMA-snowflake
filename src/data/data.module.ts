// src/data/data.module.ts

import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SnowflakeModule } from '../snowflake/snowflake.module';
import { MemoryDBModule } from '../memorydb/memorydb.module';
import { ClickstreamModule } from '../clickstream/clickstream.module';

@Module({
  imports: [SnowflakeModule, MemoryDBModule, ClickstreamModule],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
