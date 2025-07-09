/*
This file is used to define the users service for the users module.
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, ICreateUser, IUpdateUser, IUserResponse } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.usersRepository.find({
      where: { isActive: true },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt']
    });
    
    return users.map(user => ({
      ...user,
      fullName: user.fullName
    }));
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: ['blogs']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.usersRepository.findOne({
      where: { email, isActive: true }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
