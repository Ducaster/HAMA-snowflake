import { Module } from '@nestjs/common';
import { ClickstreamService } from './clickstream.service';
import { SnowflakeModule } from '../snowflake/snowflake.module';

@Module({
  imports: [SnowflakeModule],
  providers: [ClickstreamService],
  exports: [ClickstreamService], // 다른 모듈에서 사용할 수 있도록 내보냄
})
export class ClickstreamModule {}
