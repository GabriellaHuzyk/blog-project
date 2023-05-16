import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: createUserDto,
      include: { posts: { select: { title: true, createdAt: true } } },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: { posts: { select: { title: true, createdAt: true } } },
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findFirst({
      where: { id: id },
      include: { posts: { select: { title: true, createdAt: true } } },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id: id } });
  }
}
