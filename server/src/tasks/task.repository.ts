import { Repository, EntityRepository } from "typeorm";
import { Task } from "./tasks.entity";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository')
    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const task = new Task()
        const { title, description } = createTaskDTO || {}
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user

        try {
            await task.save()
        } catch (error) {
            this.logger.error(`'Failed to create task for user ${user.username} DTO : ${JSON.stringify(createTaskDTO)}  Error : ${error}`)
            throw new InternalServerErrorException('Failed to create user')
        }
        delete task.user
        return task
    }


    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')

        query.where('task.userId = :userId', { userId: user.id })

        if (status) {
            query.andWhere('task.status = :status', { status: status })
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` })
        }


        try {
            let results = await query.getMany()
            return results
        } catch (error) {
            this.logger.error(`Faile to get task for user ${user.username} DTO : ${JSON.stringify(filterDto)} errorStack : ${JSON.stringify(error)}`)
            throw new InternalServerErrorException()
        }


    }
}