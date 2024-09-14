import { Module } from '@nestjs/common';
import { MembersClubsService } from './members_clubs.service';
import { MembersClubsController } from './members_clubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import { Member } from 'src/members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, Member])],
  controllers: [MembersClubsController],
  providers: [MembersClubsService],
})
export class MembersClubsModule {}
