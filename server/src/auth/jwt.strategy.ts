import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JWTPayload } from "./jwt-payload-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: '1234567891'
            }
        )
    }


    async validate(payload: JWTPayload) {
        const { username } = payload
        const user = await this.userRepository.findOne({ username })

        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}