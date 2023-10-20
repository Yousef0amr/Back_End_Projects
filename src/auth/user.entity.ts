import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt/bcrypt.js';
import { Task } from 'src/tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;


    @OneToMany(type => Task, task => task.user, { eager: false })
    tasks: Task[]


    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<boolean> {
        const password = authCredentialsDto.password;
        return await bcrypt.compare(password, this.password);
    }
}