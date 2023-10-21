import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) taskFilter: GetTaskFilterDto, @Req() req: any): Promise<Task[]> {
        const user: User = req.user
        return this.tasksService.getAllTasks(user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTask: CreateTaskDto, @Req() req: any): Promise<Task> {
        const user = req.user
        return this.tasksService.createTask(createTask, user);
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
