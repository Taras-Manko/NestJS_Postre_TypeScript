import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilter } from "./dto/get-task-filter.dto";
import { Task } from "./task-entity";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto:GetTaskFilter,user:User):Promise<Task[]> {
        const {search,status} = filterDto
        const query = this.createQueryBuilder('task')

        query.where('task.userId = :userId',{ userId : user.id})

        if(status) {
            query.andWhere('task.status = :status',{ status })
        }

        if(search) {
            query.andWhere('(task.title = :search OR task.description = :search)', { search: `%${search}%` })
            
        }
        const tasks = await query.getMany()
        return tasks

    }


    async createTask(createTaskDto:CreateTaskDto,user:User):Promise<Task> {
        const {title,description} = createTaskDto
        const task = await new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user
        return task
    }
}