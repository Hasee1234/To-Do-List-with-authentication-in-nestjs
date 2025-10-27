import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: { email: string; password: string }) {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
  async findAll() {
    return this.userModel.find().exec();
  }
}
