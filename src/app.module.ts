import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { MembersClubsModule } from './members_clubs/members_clubs.module';
import { ClubsModule } from './clubs/clubs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './members/entities/member.entity';
import { Club } from './clubs/entities/club.entity';

@Module({
  imports: [
    MembersModule,
    ClubsModule,
    MembersClubsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial-afmartinez',
      entities: [Member, Club],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
