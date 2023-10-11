import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: String): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTask: CreateTaskDto): Task {
        return this.tasksService.createTask(createTask);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: String): Object {
        const state = this.tasksService.deleteTask(id);
        if (!state)
            return { message: "Task not found" }
        return { message: "Task has been deleted successfully" }
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: String, @Body('status') status: TaskStatus): Task {
        return this.tasksService.updateTask(id, status);
    }
}
