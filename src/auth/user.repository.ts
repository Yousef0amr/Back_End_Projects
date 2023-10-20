import { JwtPayload } from './user-payload-token';
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt/bcrypt.js';
import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
        const { username, password } = authCredentialsDto
        const user = new User();

        const hashedPassword = await bcrypt.hash(password, 10)
        user.username = username;
        user.password = hashedPassword;
        try {
            await user.save();
        } catch (error) {
            if (error.code == "23505") {
                throw new ConflictException("Username already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }

        const payload: JwtPayload = {
            username,
            id: user.id
        }
        return payload;
    }
    async login(authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
        const { username, password } = authCredentialsDto;
        const user = await User.findOneBy({ username });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const valid = await user.validateUserPassword(authCredentialsDto);
        if (!valid) {
            throw new UnauthorizedException('Wrong password')
        }
        const payload: JwtPayload = {
            username,
            id: user.id
        }
        return payload;
    }
}