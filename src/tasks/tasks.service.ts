import { TaskRepository } from './task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: TaskRepository
    ) { }
    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find({});
    }

    async getTasksWithFilters(taskFilter: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = taskFilter
        let filteredTasks: Task[] = []
        let tasks = await this.getAllTasks()
        if (status) {
            filteredTasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            filteredTasks = tasks.filter(task =>
                task.title.includes(search) || task.description.includes(search)
            )
        }

        return filteredTasks;
    }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOneBy({ id: id });
        if (!task) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const task = await this.getTaskById(id);
        if (!task) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        await this.taskRepository.delete(id);
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
