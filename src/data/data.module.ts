import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SnowflakeModule } from '../snowflake/snowflake.module';
import { MemoryDBModule } from '../memorydb/memorydb.module';
import { ClickstreamModule } from '../clickstream/clickstream.module';
import { AuthModule } from '../auth/auth.module'; // ✅ 추가

@Module({
  imports: [SnowflakeModule, MemoryDBModule, ClickstreamModule, AuthModule], // ✅ 추가
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
