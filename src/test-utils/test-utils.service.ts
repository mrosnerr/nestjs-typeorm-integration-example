import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import User from '../authentication/model/User.entity';
import { UserService } from '../authentication/services/user.service';

@Injectable()
export class TestUtilsService {
  constructor(
    // We can inject in the underlying TypeORM database connection
    private connection: Connection,

    // And our previously defined UserService
    private userService: UserService,
  ) {}

  async wipeDb() {
    // Passing in true drops all existing tables, and guarantees a clean db
    await this.connection.synchronize(true);
  }

  async createUser(): Promise<User> {
    // These could be dynamically generated to avoid duplicating
    // email which would violate our unique index when using multiple
    // users within a single test
    return await this.userService.saveUser({
      name: "Cap'n Dreadful",
      email: 'capn@dreadful.com',
    });
  }
}
