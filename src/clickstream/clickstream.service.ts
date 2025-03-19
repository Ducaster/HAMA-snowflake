// src/clickstream/clickstream.service.ts

import { Injectable } from '@nestjs/common';
import { SnowflakeService } from '../snowflake/snowflake.service';

@Injectable()
export class ClickstreamService {
  constructor(private readonly snowflakeService: SnowflakeService) {}

  async getTopProductsByChildrenCount(count: number): Promise<any> {
    console.log(`클릭스트림 데이터 요청: 자녀 수 ${count}`); // 요청 로그
    const query = `
      SELECT product_id, COUNT(*) as click_count
      FROM clickstream
      WHERE user_id IN (
        SELECT user_id
        FROM users
        WHERE children_count = ${count}
      )
      GROUP BY product_id
      ORDER BY click_count DESC
      LIMIT 5;
    `;

    const topProducts = await this.snowflakeService.executeQuery(query);
    console.log('상위 제품 조회 결과:', topProducts); // 결과 로그
    return topProducts;
  }
}
