import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwt: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
        const payload = await this.userRepository.signUp(authCredentialsDto)
        const token = this.jwt.sign(payload)
        return { status: 'success', data: { token } }
    }
    async login(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
        const payload = await this.userRepository.login(authCredentialsDto)
        const token = this.jwt.sign(payload)
        return { status: 'success', data: { token } }
    }
}
