import { TaskRepository } from './task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }
    async getAllTasks(user: User): Promise<Task[]> {
        return await Task.find({ where: { userId: user.id } });
    }

    async getTasksWithFilters(taskFilter: GetTaskFilterDto, user: User): Promise<Task[]> {

        return this.taskRepository.getTasks(taskFilter, user)
    }



    async getTaskById(id: number): Promise<Task> {
        const task = await Task.findOneBy({ id: id });
        if (!task) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number): Promise<void> {
        const task = await this.getTaskById(id);
        if (!task) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        await Task.delete(id);
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
