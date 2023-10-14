import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = []
    getAllTasks(): Task[] {
        return this.tasks
    }

    getTasksWithFilters(taskFilter: GetTaskFilterDto): Task[] {
        const { status, search } = taskFilter
        let filteredTasks: Task[] = []
        let tasks = this.getAllTasks()
        if (status) {
            filteredTasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            filteredTasks.concat(tasks.filter(task =>
                task.title.includes(search) || task.description.includes(search)
            ))
        }

        return filteredTasks;
    }

    getTaskById(id: String): Task {
        const task = this.tasks.find(task => task.id == id);
        if (!task) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        return task;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task)
        return task;
    }

    deleteTask(id: String): void {
        let index: number = this.tasks.findIndex(task => task.id == id);
        if (index == -1) {
            throw new NotFoundException(`Task With ID ${id} not found`);
        }
        this.tasks.splice(index, 1);
    }

    updateTask(id: String, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
