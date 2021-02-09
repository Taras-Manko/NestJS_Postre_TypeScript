import { Injectable, NotFoundException} from '@nestjs/common';
import {  TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task-entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskrepository:TaskRepository
    ) {}


   async getAllTasks(filterDto:GetTaskFilter):Promise<Task[]> {
      return  this.taskrepository.getTasks(filterDto) 
    }

   async getTaskById(id:number):Promise<Task> {
        const found = await this.taskrepository.findOne(id)

        if(!found) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
        return found
    }

    async createTask(createTaskDto:CreateTaskDto):Promise<Task> {
        return this.taskrepository.createTask(createTaskDto)
    }

    async deleteTaskId(id:number):Promise<void> {
        const found = await this.taskrepository.delete(id)
        if(found.affected == 0) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
    }

    async updateStatusById(id:number,status:TaskStatus):Promise<Task> {
        const task =await this.getTaskById(id)
        task.status = status
        await task.save()
        return task
    }
}
