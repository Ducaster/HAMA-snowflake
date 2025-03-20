// src/data/data.module.ts

import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SnowflakeModule } from '../snowflake/snowflake.module';
import { MemoryDBModule } from '../memorydb/memorydb.module';

@Module({
  imports: [SnowflakeModule, MemoryDBModule],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
