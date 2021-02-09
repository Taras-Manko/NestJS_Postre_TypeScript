import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig:TypeOrmModuleOptions = {
    type:'postgres',
    host:'localhost',
    port:3003,
    username:'postgres',
    password:'v1zxcvet',
    database:'tasksmanagment',
    autoLoadEntities:true,
    synchronize:true
}