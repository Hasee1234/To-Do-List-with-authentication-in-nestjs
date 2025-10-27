// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UserModule } from 'src/user/user.module';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     UserModule,
//     JwtModule.register({
//       secret:process.env.JWT_KEY,
//       signOptions: { expiresIn: '1d' },
//     })
//   ],
//   providers: [AuthService],
//   controllers: [AuthController]
// })
// export class AuthModule {}


// ...existing code...
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_kEY || 'dev_secret_not_for_prod', // <- set a secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
// ...existing code...