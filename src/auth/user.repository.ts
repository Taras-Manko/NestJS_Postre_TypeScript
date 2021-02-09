
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserCreadentialDto } from "./dto/user-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(userDto:UserCreadentialDto):Promise<void> {
        const {email,password} = userDto

        const user = new User()
        user.email = email;
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password,user.salt)

        try {
            await user.save()
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Email is already')
            }
            throw new InternalServerErrorException()
        }
        
    }

    async validateSignin(userDto:UserCreadentialDto):Promise<string> {
        const {email,password} = userDto
        const user = await User.findOne({ email })

        if(user && await user.validatePassword(password)) {
            return user.email
        } else {
            return null
        }
    }

    private async hashPassword(password:string,salt:string):Promise<string> {
        return await bcrypt.hash(password,salt)
    }
}