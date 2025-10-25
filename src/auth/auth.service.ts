import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(private userService:UserService, private jwtService:JwtService){}

    async signUp(email:string, password:string){
    const hashed = await bcrypt.hash(password, 10);
    return this.userService.create({ email, password: hashed });
  }

  async login(email:string, password:string){
    const user=await this.userService.findByEmail(email)
      if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  
  }
}
