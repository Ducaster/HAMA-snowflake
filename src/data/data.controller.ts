// src/data/data.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Request() req) {
    const userId = req.user.userId; // JWT의 sub 부분을 사용하여 userId 가져오기
    console.log('사용자 데이터 요청 수신, userId:', userId);
    return await this.dataService.getUserData(userId); // userId를 사용하여 데이터 조회
  }

  // 유저 생성 메서드 삭제
}
