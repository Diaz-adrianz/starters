import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';
import { DatabaseKeys } from '../../database/database-keys.constant';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppDataSource } from '../../database/typeorm/app-data-source';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    // DB
    // ---------------------------------
    private db: TypeOrmHealthIndicator,
    @InjectDataSource(DatabaseKeys.DEFAULT)
    private defaultDatabase: AppDataSource,

    // ---------------------------------
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck('defaultDatabase', {
          connection: this.defaultDatabase,
        }),
      () => this.memory.checkHeap('memoryHeap', 300 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }
}
