import { Body, Controller, Post ,ValidationPipe} from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserCreadentialDto } from './dto/user-credential.dto';

@Controller('auth')
export class AuthController {
    
    constructor(private userServise:AuthService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) userDto:UserCreadentialDto):Promise<void> {
        return this.userServise.signup(userDto)
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) userDto:UserCreadentialDto):Promise<{ accesToken }> {
        return this.userServise.signin(userDto)
    }

    
}
