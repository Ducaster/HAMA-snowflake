// src/data/data.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('users')
  async getUsers() {
    console.log('사용자 데이터 요청 수신');
    return await this.dataService.getUserData();
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    console.log('사용자 데이터 생성 요청 수신:', userData);
    return await this.dataService.insertUserData(userData);
  }
}
