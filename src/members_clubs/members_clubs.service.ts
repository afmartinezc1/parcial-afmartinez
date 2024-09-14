import { Injectable, NotFoundException } from '@nestjs/common';
import { Club } from '../clubs/entities/club.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class MembersClubsService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async addMemberToClub(clubId: string, memberId: string) {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException('El socio no existe');
    }
    club.members = [...club.members, member];
    return this.clubRepository.save(club);
  }

  async findMembersFromClub(clubId: string) {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    return club.members;
  }

  async findMemberFromClub(clubId: string, memberId: string) {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    const member = club.members.find((m) => m.id === memberId);
    if (!member) {
      throw new NotFoundException('El socio no es parte del club');
    }
    return member;
  }

  async deleteMemberFromClub(clubId: string, memberId: string) {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['members'],
    });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    const memberIndex = club.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException('El socio no es parte del club');
    }
    club.members.splice(memberIndex, 1);
    return this.clubRepository.save(club);
  }

  // async updateMembersFromClub(clubId: string, memberIds: string[]) {
  //   const club = await this.clubRepository.findOne({ where: { id: clubId } });
  //   if (!club) {
  //     throw new NotFoundException('El club no existe');');
  //   }
  //   const members = await this.memberRepository.find({
  //     where: { id: { $in: memberIds } },
  //   });
  //   club.members = members;
  //   return this.clubRepository.save(club);
  // }
}
