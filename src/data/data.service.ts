// src/data/data.service.ts
import { Injectable } from '@nestjs/common';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { MemoryDBService } from '../memorydb/memorydb.service';

@Injectable()
export class DataService {
  constructor(
    private readonly snowflakeService: SnowflakeService,
    private readonly memoryDBService: MemoryDBService,
  ) {}

  /**
   * 사용자 데이터 조회 (MemoryDB)
   */
  async getUserData(userId: string): Promise<any> {
    console.log('🔍 사용자 데이터 조회 요청, userId:', userId);

    // MemoryDB에서 사용자 데이터 조회
    const userData = await this.memoryDBService.getUserData(userId);

    if (!userData) {
      console.warn('⚠️ 사용자 데이터가 존재하지 않습니다.');
      return null;
    }

    console.log('✅ MemoryDB에서 가져온 사용자 데이터:', userData);

    // children 개수 추가
    const numberOfChildren = userData.children ? userData.children.length : 0;

    return {
      ...userData,
      numberOfChildren,
    };
  }

  /**
   * 특정 userId를 기반으로 추천 제품 조회
   */
  async getTopProductsByUserId(userId: string): Promise<any> {
    console.log('🔍 사용자 ID 기반 추천 제품 조회 시작...');

    // MemoryDB에서 userId로 사용자 정보 조회
    const userData = await this.memoryDBService.getUserData(userId);
    if (!userData || !userData.children) {
      console.warn('⚠️ 사용자 데이터 또는 children 정보 없음.');
      return [];
    }

    const numberOfChildren = userData.children.length;

    // Snowflake에서 추천 제품 조회 (SQL Injection 방지를 위해 바인딩 사용)
    const query = `
      SELECT product_x2Duid, COUNT(*) as count
      FROM HAMA_SNOWFLAKE.PUBLIC.ICEBERG_TABLE
      WHERE babyInfo_x2Dcount = ?
      GROUP BY product_x2Duid
      ORDER BY count DESC
      LIMIT 5;
    `;

    try {
      const topProducts = await this.snowflakeService.executeQuery(query, [
        numberOfChildren,
      ]);
      console.log('✅ 상위 5개 제품 조회 결과:', topProducts);
      return topProducts;
    } catch (error) {
      console.error('❌ 추천 제품 조회 실패:', error);
      return [];
    }
  }
}
