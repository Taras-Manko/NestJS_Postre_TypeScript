import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilter } from "./dto/get-task-filter.dto";
import { Task } from "./task-entity";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto:GetTaskFilter):Promise<Task[]> {
        const {search,status} = filterDto
        const query = this.createQueryBuilder('task')

        if(status) {
            query.andWhere('task.status = :status',{ status })
        }

        if(search) {
            query.andWhere('(task.title = :search OR task.description = :search)', { search: `%${search}%` })
            
        }
        const tasks = await query.getMany()
        return tasks

    }


    async createTask(createTaskDto:CreateTaskDto):Promise<Task> {
        const {title,description} = createTaskDto
        const task = await new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        await task.save()
        return task
    }
}