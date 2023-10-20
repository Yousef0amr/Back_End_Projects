import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/sign-up')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Object {
        return this.authService.signUp(authCredentialsDto);
    }
    @Post('/sign-in')
    login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Object {
        return this.authService.login(authCredentialsDto);
    }




}
