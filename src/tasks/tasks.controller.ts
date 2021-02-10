import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common'
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { PipeStatus } from './pipes/create-pipe-status.pipe';
import { Task } from './task-entity';
import { TaskStatus } from './task-status.enum';
import {TasksService} from './tasks.service'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService:TasksService) {}

    @Get() 
    getAllTasks(@Query(ValidationPipe) getTaskFilter:GetTaskFilter,
    @GetUser() user:User):Promise<Task[]> {
        this.logger.verbose(`User: ${user.email} all tasks.${JSON.stringify(getTaskFilter)}`)
        return this.taskService.getAllTasks(getTaskFilter,user)
          
    }

    @Get('/:id')
    async getTaskById(@Param('id' ,ParseIntPipe,) id:number,@GetUser() user:User):Promise<Task> {
        return await this.taskService.getTaskById(id,user)
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createTask(
        @Body() createTaskDto:CreateTaskDto,
        @GetUser() user:User
        ):Promise<Task> {
            this.logger.verbose(`User ${user.email} created a new task.Data:${JSON.stringify(createTaskDto)}`)
        return this.taskService.createTask(createTaskDto,user)
    }

    @Delete('/:id')
    deleteTaskId(@Param('id',ParseIntPipe) id:number,
    @GetUser() user:User):Promise<void> {
        return this.taskService.deleteTaskId(id,user)
    }

    @Patch('/:id/status')
    updateTaskId(
        @Param('id' ,ParseIntPipe) id:number,
        @Body('status',PipeStatus) status:TaskStatus,
        @GetUser() user:User
    ):Promise<Task> {
        return this.taskService.updateStatusById(id,status,user)
    }
}
