import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authcredentialsDto)
    }

    async signIn(authcredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validatePassword(authcredentialsDto)
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials')
        }
        let payload: JWTPayload = { username };
        const accessToken = await this.jwtService.sign(payload)
        return { accessToken }
    }


}
