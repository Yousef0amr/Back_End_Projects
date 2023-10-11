import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = []
    getAllTasks(): Task[] {
        return this.tasks
    }

    getTaskById(id: String): Task {
        return this.tasks.find(task => task.id == id);
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


    deleteTask(id: String): Boolean {
        let index: number = this.tasks.findIndex(task => task.id == id);
        if (index == -1) {
            return false
        }
        this.tasks.splice(index, 1);
        return true
    }

    updateTask(id: String, status: TaskStatus): Task {
        const task = this.tasks.find(task => {
            if (task.id == id) {
                task.status = status;
            }
        });
        return task
    }
}
