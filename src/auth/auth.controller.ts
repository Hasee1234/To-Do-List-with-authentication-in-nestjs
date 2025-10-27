import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor( private authService:AuthService, private userService:UserService){}

    @Post('signUp')
    signup(@Body() body: { email: string; password: string }){
        return this.authService.signUp(body.email,body.password)
    }

    @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
    @Get('users')
  getAllUsers() {
    return this.userService.findAll();
}
}
