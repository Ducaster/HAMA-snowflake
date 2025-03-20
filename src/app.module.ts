import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module'; // ✅ 추가
import { PassportModule } from '@nestjs/passport'; // ✅ 추가
import { JwtModule } from '@nestjs/jwt'; // ✅ 추가

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // ✅ 기본 전략 등록
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hama-jwt-secret', // ✅ 환경변수에서 JWT_SECRET 가져오기
      signOptions: { expiresIn: '1h' }, // ✅ 토큰 유효 시간 설정
    }),
    SnowflakeModule,
    DataModule,
    AuthModule, // ✅ 추가 (JWT 인증을 위한 모듈)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
