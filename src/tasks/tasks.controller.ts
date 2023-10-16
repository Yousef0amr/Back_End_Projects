import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) taskFilter: GetTaskFilterDto): Promise<Task[]> {
        if (Object.keys(taskFilter).length) {
            return this.tasksService.getTasksWithFilters(taskFilter);
        }
        else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTask: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTask);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Object {
        this.tasksService.deleteTask(id);
        return { message: "Task has been deleted successfully" }
    }

    @Patch('/:id/status')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidation) status: TaskStatus): Promise<Task> {
        return this.tasksService.updateTask(id, status);
    }
}
