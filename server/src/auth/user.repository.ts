import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as crypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User>{


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        const user = new User()
        user.username = username
        user.salt = await crypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException("username already existst!")
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })
        if (user && await user.validatePassword(password)) {
            return user.username
        }
        return null
    }


    private async hashPassword(password: string, salt: string) {
        return await crypt.hash(password, salt)
    }
}