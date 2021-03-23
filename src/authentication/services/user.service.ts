import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../model/User.entity';
import { IUser } from '../model/User.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  // InjectRepository injects the `User` entity wrapped as a TypeORM repository
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveUser(user: IUser) {
    const toSave = new User();
    toSave.name = user.name;
    toSave.email = user.email;
    return this.userRepository.save(toSave);
  }

  async findUser(user: IUser): Promise<User> {
    return this.userRepository.findOne(user);
  }
}
