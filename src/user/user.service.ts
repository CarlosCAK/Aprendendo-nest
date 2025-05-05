import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...createUserDto,
    });
    user.password =  bcrypt.hashSync(user.password, 10);
    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    await this.userRepository.remove(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
