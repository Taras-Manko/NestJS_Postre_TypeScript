import { User } from 'src/auth/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity,ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(user => User,user => user.task, { eager:false})
  user:User

  @Column()
  userId:number
}