/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Club, Member],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([Club, Member]),
];
