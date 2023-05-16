import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Prisma } from '@prisma/client';
import { NotFoundError } from '../../common/filters/http-exception/errors/types/not-found-error';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { authorEmail } = createPostDto;

    delete createPostDto.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!user) {
      throw new NotFoundError('Author not found.');
    }

    const data: Prisma.PostCreateInput = {
      ...createPostDto,
      author: {
        connect: { email: authorEmail },
      },
    };

    return await this.prisma.post.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: { author: { select: { name: true } } },
    });
  }

  async findOne(id: number) {
    return await this.prisma.post.findFirst({
      where: { id: id },
      include: { author: { select: { name: true, email: true } } },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const { authorEmail } = updatePostDto;

    if (!authorEmail) {
      return this.prisma.post.update({
        data: updatePostDto,
        where: { id },
      });
    }

    delete updatePostDto.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!user) {
      throw new NotFoundError('Author not found.');
    }

    const data: Prisma.PostUpdateInput = {
      ...updatePostDto,
      author: {
        connect: { email: authorEmail },
      },
    };

    return await this.prisma.post.update({
      where: { id },
      data,
      include: { author: { select: { name: true } } },
    });
  }

  async remove(id: number) {
    return await this.prisma.post.delete({ where: { id: id } });
  }
}
