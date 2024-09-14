import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  Body,
  Put,
} from '@nestjs/common';
import { MembersClubsService } from './members_clubs.service';

@Controller('clubs')
export class MembersClubsController {
  constructor(private readonly membersClubsService: MembersClubsService) {}

  @Post(':clubId/members/:memberId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membersClubsService.addMemberToClub(clubId, memberId);
  }

  @Get(':clubId/members')
  async getMembersByClub(@Param('clubId') clubId: string) {
    return this.membersClubsService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:memberId')
  async getMemberByClubAndMember(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membersClubsService.findMemberFromClub(clubId, memberId);
  }

  @Put(':clubId/members')
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body() memberIds: string[],
  ) {
    return this.membersClubsService.updateMembersFromClub(clubId, memberIds);
  }

  @Delete(':clubId/members/:memberId')
  @HttpCode(204)
  async removeMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membersClubsService.deleteMemberFromClub(clubId, memberId);
  }
}
