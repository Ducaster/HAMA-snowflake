// src/data/data.service.ts

import { Injectable } from '@nestjs/common';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { MemoryDBService } from '../memorydb/memorydb.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClickstreamService } from '../clickstream/clickstream.service';

@Injectable()
export class DataService {
  constructor(
    private readonly snowflakeService: SnowflakeService,
    private readonly memoryDBService: MemoryDBService,
    private readonly clickstreamService: ClickstreamService,
  ) {}

  /**
   * 데이터 조회 예시
   */
  async getUserData(): Promise<any[]> {
    const query = `
      SELECT * FROM DATABASE.SCHEMA.USERS 
      WHERE active = TRUE
      LIMIT 100
    `;
    console.log('사용자 데이터 조회 쿼리:', query);

    try {
      const results = await this.snowflakeService.executeQuery(query);
      console.log('사용자 데이터 조회 결과:', results);
      return results;
    } catch (error) {
      console.error('사용자 데이터 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터 삽입 예시
   */
  async insertUserData(user: any): Promise<boolean> {
    const query = `
      INSERT INTO DATABASE.SCHEMA.USERS (name, email, created_at)
      VALUES ('${user.name}', '${user.email}', CURRENT_TIMESTAMP())
    `;
    console.log('사용자 데이터 삽입 쿼리:', query);

    try {
      await this.snowflakeService.executeQuery(query);
      console.log('사용자 데이터 삽입 성공');
      return true;
    } catch (error) {
      console.error('사용자 데이터 삽입 실패:', error);
      throw error;
    }
  }

  async getTopProductsByUserId(userId: string): Promise<any> {
    // MemoryDB에서 userId로 아이들 정보 가져오기
    const childrenData = await this.memoryDBService.getUserData(userId);
    if (!childrenData) {
      return []; // 아이들 정보가 없으면 빈 배열 반환
    }

    const children = childrenData.children; // 아이들 정보에서 children 배열 추출
    const numberOfChildren = children.length;

    // Clickstream 데이터에서 동일한 아이 명 수를 가진 사용자가 클릭한 상품 정보 가져오기
    const topProducts =
      await this.clickstreamService.getTopProductsByChildrenCount(
        numberOfChildren,
      );

    return topProducts; // 상위 5개 상품 정보 반환
  }
}
