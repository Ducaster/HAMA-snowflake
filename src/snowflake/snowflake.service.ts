// src/snowflake/snowflake.service.ts

import { Injectable } from '@nestjs/common';
import * as snowflake from 'snowflake-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnowflakeService {
  private connection: snowflake.Connection;

  constructor(private readonly configService: ConfigService) {
    snowflake.configure({ ocspFailOpen: false });

    this.connection = snowflake.createConnection({
      account: this.configService.get<string>('SNOWFLAKE_ACCOUNT') || '',
      username: this.configService.get<string>('SNOWFLAKE_USERNAME'),
      password: this.configService.get<string>('SNOWFLAKE_PASSWORD'),
      warehouse: this.configService.get<string>('SNOWFLAKE_WAREHOUSE'),
      database: this.configService.get<string>('SNOWFLAKE_DATABASE'),
      schema: this.configService.get<string>('SNOWFLAKE_SCHEMA'),
      role: this.configService.get<string>('SNOWFLAKE_ROLE'),
      authenticator: 'SNOWFLAKE',
      clientSessionKeepAlive: true,
    });

    this.initConnection();
  }

  private initConnection(): void {
    console.log('Snowflake 연결 초기화 중...');
    this.connection.connect((err, conn) => {
      if (err) {
        console.error('Snowflake 연결 실패:', err.message);
        throw err;
      } else {
        console.log(
          'Snowflake에 성공적으로 연결되었습니다. 연결 ID:',
          conn.getId(),
        );
      }
    });
  }

  async executeQuery(sqlText: string): Promise<any> {
    console.log('쿼리 실행 중:', sqlText);
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error('쿼리 실행 실패:', err.message);
            reject(err);
          } else {
            console.log('성공적으로 쿼리 실행:', stmt.getSqlText());
            resolve(rows);
          }
        },
      });
    });
  }

  async isConnectionValid(): Promise<boolean> {
    try {
      const isValid = await this.connection.isValidAsync();
      return isValid;
    } catch (error) {
      console.error('연결 유효성 확인 실패:', error.message);
      return false;
    }
  }

  async closeConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.destroy((err) => {
        if (err) {
          console.error('연결 종료 실패:', err.message);
          reject(err);
        } else {
          console.log('Snowflake 연결이 성공적으로 종료되었습니다.');
          resolve();
        }
      });
    });
  }
}
