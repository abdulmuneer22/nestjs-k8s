import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';



@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {

    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user)
    }



    async getTasks(filterData: GetTasksFilterDto, user: User): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterData, user)
    }




    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { userId: user.id, id } })
        if (!found) {
            throw new NotFoundException(`Task with id : ${id} not found`)
        }
        return found
    }



    async deleteTaskById(id: number, user: User): Promise<void> {
        let result = await this.taskRepository.delete({ id, userId: user.id })
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id : ${id} not found`)
        }
    }
    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        let task = await this.getTaskById(id, user)
        task.status = status
        return await task.save()
    }
}
