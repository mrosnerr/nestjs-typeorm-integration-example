import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { TestUtilsModule } from './test-utils/test-utils.module';

@Module({
  imports: [
    // This will load `.env` by default
    ConfigModule.forRoot(),

    // We need to use `forRootAsync` to be able to inject the
    // `ConfigService` from `ConfigModule`
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_CONNECTION'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: configService.get('DB_SYNCHRONIZE'),

          // The NestJS application should be running from the
          // transpiled TypeORM entity js files in `dist/`
          entities: ['dist/**/*.entity.js'],
        } as TypeOrmModuleOptions;
      },
    }),

    AuthenticationModule,

    TestUtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
