import { Injectable, NotFoundException} from '@nestjs/common';
import {  TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task-entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskrepository:TaskRepository
    ) {}


   async getAllTasks(filterDto:GetTaskFilter,user:User):Promise<Task[]> {
      return  this.taskrepository.getTasks(filterDto,user) 
    }

   async getTaskById(id:number,user:User):Promise<Task> {
        const found = await this.taskrepository.findOne({ where: {id, userId:user.id}})

        if(!found) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
        return found
    }

    async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task> {
        return this.taskrepository.createTask(createTaskDto,user)
    }

    async deleteTaskId(id:number,user:User):Promise<void> {
        const found = await this.taskrepository.delete({ id, userId: user.id})
        if(found.affected == 0) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
    }

    async updateStatusById(id:number,status:TaskStatus,user:User):Promise<Task> {
        const task =await this.getTaskById(id,user)
        task.status = status
        await task.save()
        return task
    }
}
