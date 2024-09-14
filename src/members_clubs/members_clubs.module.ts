import { Module } from '@nestjs/common';
import { MembersClubsService } from './members_clubs.service';
import { MembersClubsController } from './members_clubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, Member])],
  controllers: [MembersClubsController],
  providers: [MembersClubsService],
})
export class MembersClubsModule {}
