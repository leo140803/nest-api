import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { Auth } from '../common/auth.decorator';
import { WebResponse } from 'src/model/web.models';
import { User } from '@prisma/client';

@Controller('/api/contacts')
export class ContactController {
  constructor(private ContactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.ContactService.create(user, request);
    return {
      data: result,
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.ContactService.get(user, contactId);
    return {
      data: result,
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    request.id = contactId;
    const result = await this.ContactService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:contactId')
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.ContactService.delete(user, contactId);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactRequest = {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 1,
    };
    return this.ContactService.search(user, request);
  }
}
