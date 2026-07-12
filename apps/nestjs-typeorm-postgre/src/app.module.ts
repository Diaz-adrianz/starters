import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig, envConfig, envConfigSchema } from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './src/modules/posts/posts.module';
import { defaultDataSourceFactory } from './database/default/datasource';

@Module({
  imports: [
    // configs
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema: envConfigSchema,
    }),

    // databases
    TypeOrmModule.forRootAsync({
      name: 'default',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) =>
        defaultDataSourceFactory(configService),
    }),

    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
