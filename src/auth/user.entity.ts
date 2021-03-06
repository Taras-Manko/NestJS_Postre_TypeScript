import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique,OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Task } from 'src/tasks/task-entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => Task,task => task.user,{ eager: true})
  task:Task[]

  async validatePassword(password:string):Promise<boolean> {
    const hash = await bcrypt.hash(password,this.salt)
    return hash === this.password
  }
}