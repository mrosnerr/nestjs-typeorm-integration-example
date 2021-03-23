import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TestUtilsService } from './test-utils.service';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    // Properties from `.env.test` will take precedence over those in `.env`
    ConfigModule.forRoot({
      envFilePath: ['.env.test', '.env'],
    }),

    // This will be the root TypeORM instance we'll use for all of our
    // integration tests

    // We need to use `forRootAsync` to be able to inject the `ConfigService`
    // from `ConfigModule`
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

          // Tests should be running using ts-jest which would pull the
          // TypeORM entity `*.ts` files direclty from `src/**`
          entities: ['**/*.entity.ts'],

          // If something's wrong with our test db setup, one error should be sufficent
          retryAttempts: 0,
        } as TypeOrmModuleOptions;
      },
    }),

    // Adding `AuthenticationModule` as a dependency will allow us to leverage the `UserService`
    // within our `TestUtilsService`. This will allow us to create users as part of fixture
    // setup in our tests
    AuthenticationModule,
  ],
  providers: [TestUtilsService],

  // And of course, we'll want to export the TestUtilsService service so that our tests can make use of it
  exports: [TestUtilsService],
})
export class TestUtilsModule {}
