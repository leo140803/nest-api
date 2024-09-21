import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaService } from '../src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';

export class TestService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async deleteUser() {
    this.logger.info('masuk');
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: 'test',
        name: await bcrypt.hash('test', 10),
      },
    });
  }
}
