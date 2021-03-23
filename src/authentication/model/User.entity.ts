import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './User.interface';

@Entity()
export default class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  @Index({ unique: true })
  email: string;
}
