// src/data/data.module.ts

import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SnowflakeModule } from '../snowflake/snowflake.module';

@Module({
  imports: [SnowflakeModule],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
