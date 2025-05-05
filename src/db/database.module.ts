import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'lb_nest',
      entities: [UserEntity], // Adicione aqui suas entidades
      synchronize: true, // Isso vai sincronizar automaticamente o schema
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
