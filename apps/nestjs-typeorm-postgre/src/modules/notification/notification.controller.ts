import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ReqUser } from '../../common/decorators/req-user.decorator';
import { Principal } from '../../shared/classes/principal.class';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/device/register')
  registerDevice(
    @Body() registerDeviceDto: RegisterDeviceDto,
    @ReqUser() { user }: Principal,
  ) {
    return this.notificationService.registerDevice(user.id, registerDeviceDto);
  }

  @Delete('/device/unregister/:token')
  unregisterDevice(
    @Param('token') token: string,
    @ReqUser() { user }: Principal,
  ) {
    return this.notificationService.unregisterDevice(user.id, token);
  }
}
