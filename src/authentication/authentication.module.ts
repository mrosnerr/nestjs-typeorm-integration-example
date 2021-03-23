import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import User from './model/User.entity';

@Module({
  imports: [
    // This will add our `User` entity within scope of this module
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],

  // Export this service so that we can leverage it from modules that depend on this one
  exports: [UserService],
})
export class AuthenticationModule {}
