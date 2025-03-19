// src/app.module.ts

import { Module } from '@nestjs/common';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { DataModule } from './data/data.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SnowflakeModule,
    DataModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
