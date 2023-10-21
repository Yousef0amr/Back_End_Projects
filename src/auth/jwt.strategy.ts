import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from "./user-payload-token";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secretKey'
            }
        );
    }

    async validate(payload: JwtPayload): Promise<User> {
        const username = payload.username

        const user = await User.findOne({ where: { username } })
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}