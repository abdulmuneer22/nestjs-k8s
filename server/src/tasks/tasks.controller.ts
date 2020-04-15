import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Patch, ParseIntPipe, Query, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { Task } from './tasks.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';



@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController')
    constructor(private taskService: TasksService) { }

    @Get()
    async getTasks(
        @Query(ValidationPipe) filterData: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks with filters = ${JSON.stringify(filterData)}`)
        return this.taskService.getTasks(filterData, user)
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.getTaskById(id, user)
    }


    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} is creating new task with payload ${JSON.stringify(createTaskDTO)}`)
        return this.taskService.createTask(createTaskDTO, user)
    }


    @Delete('/:id')
    async deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskService.deleteTaskById(id, user)
    }

    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status, user)
    }
}
