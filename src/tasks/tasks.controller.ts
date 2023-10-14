import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) taskFilter: GetTaskFilterDto): Task[] {
        if (Object.keys(taskFilter).length) {
            return this.tasksService.getTasksWithFilters(taskFilter);
        }
        else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: String): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTask: CreateTaskDto): Task {
        return this.tasksService.createTask(createTask);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: String): Object {
        this.tasksService.deleteTask(id);
        return { message: "Task has been deleted successfully" }
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: String, @Body('status', TaskStatusValidation) status: TaskStatus): Task {
        return this.tasksService.updateTask(id, status);
    }
}
