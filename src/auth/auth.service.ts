// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';
// import * as bcrypt from "bcrypt"

// @Injectable()
// export class AuthService {
//     constructor(private userService:UserService, private jwtService:JwtService){}

//     async signUp(email:string, password:string){
//     const hashed = await bcrypt.hash(password, 10);
//     return this.userService.create({ email, password: hashed });
//   }

//   async login(email:string, password:string){
//     const user=await this.userService.findByEmail(email)
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const payload = { sub: user._id, email: user.email };
//     return { access_token: this.jwtService.sign(payload) };
  
//   }
// }



import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signUp(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Email and password are required');
    try {
      const hashed = await bcrypt.hash(String(password), 10);
      return this.userService.create({ email, password: hashed });
    } catch (err) {
      console.error('signUp error:', err);
      throw new InternalServerErrorException();
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Email and password are required');
    try {
      const user = await this.userService.findByEmail(email);
      console.log('login: user from DB =', user);

      if (!user || typeof user.password !== 'string') {
        // either user not found or stored password missing/wrong type
        throw new UnauthorizedException('Invalid credentials');
      }

      const match = await bcrypt.compare(String(password), user.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const payload = { sub: user._id?.toString?.() ?? user._id, email: user.email };

      try {
        return { access_token: this.jwtService.sign(payload) };
      } catch (err) {
        console.error('JWT sign error:', err);
        throw new InternalServerErrorException('Token generation failed');
      }
    } catch (err) {
      // rethrow expected http errors, log unexpected
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) throw err;
      console.error('login error:', err);
      throw new InternalServerErrorException();
    }
  }
}