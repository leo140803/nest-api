import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { UserRequest } from 'src/model/user.model';
import { UserResponse } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from 'src/common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async register(request: UserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const registerRequest = this.ValidationService.validate(
      UserValidation.REGISTER,
      request,
    );
    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
    return null;
  }
}
