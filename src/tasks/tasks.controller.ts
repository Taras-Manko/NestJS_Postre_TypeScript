import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { PipeStatus } from './pipes/create-pipe-status.pipe';
import { Task } from './task-entity';
import { TaskStatus } from './task-status.enum';
import {TasksService} from './tasks.service'

@Controller('tasks')
export class TasksController {
    constructor(private taskService:TasksService) {}

    @Get() 
    getAllTasks(@Query(ValidationPipe) getTaskFilter:GetTaskFilter):Promise<Task[]> {
        return this.taskService.getAllTasks(getTaskFilter)
          
    }

    @Get('/:id')
    async getTaskById(@Param('id' ,ParseIntPipe) id:number):Promise<Task> {
        return await this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createTask(@Body() createTaskDto:CreateTaskDto):Promise<Task> {
        return this.taskService.createTask(createTaskDto)
    }

    @Delete('/:id')
    deleteTaskId(@Param('id',ParseIntPipe) id:number):Promise<void> {
        return this.taskService.deleteTaskId(id)
    }

    @Patch('/:id/status')
    updateTaskId(
        @Param('id' ,ParseIntPipe) id:number,
        @Body('status',PipeStatus) status:TaskStatus
    ):Promise<Task> {
        return this.taskService.updateStatusById(id,status)
    }
}
