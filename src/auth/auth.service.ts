import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { UserCreadentialDto } from './dto/user-credential.dto';
import { JwtInterface } from './jwt.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService:JwtService
        ) {}

    async signup(userDto:UserCreadentialDto):Promise<void> {
        return this.userRepository.signup(userDto)
    }

    async signin(userDto:UserCreadentialDto):Promise<{ accesToken }> {
        const email =  await this.userRepository.validateSignin(userDto)
        if(!email) {
            throw new UnauthorizedException('Invalid credentionals')
        }
        const payload:JwtInterface = { email }
        const accesToken = await this.jwtService.sign(payload)

        return { accesToken }

    }
}
