import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersClubsService } from './members_clubs.service';
import { Club } from '../clubs/entities/club.entity';
import { Member } from '../members/entities/member.entity';

import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';

describe('MembersClubsService', () => {
  let service: MembersClubsService;
  let clubRepository: Repository<Club>;
  let memberRepository: Repository<Member>;
  let club: Club;
  let membersList: Member[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MembersClubsService],
    }).compile();

    service = module.get<MembersClubsService>(MembersClubsService);
    clubRepository = module.get<Repository<Club>>(getRepositoryToken(Club));
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await clubRepository.clear();
    await memberRepository.clear();

    membersList = [];
    for (let i = 0; i < 5; i++) {
      const member: Member = await memberRepository.save({
        name: faker.person.fullName(),
        mail: faker.internet.email(),
        birthdate: new Date(),
      });
      membersList.push(member);
    }

    club = await clubRepository.save({
      name: faker.company.name(),
      members: membersList,
      foundationDate: new Date(),
      description: faker.lorem.sentence(10),
      image: '',
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to the club', async () => {
    const newMember: Member = await memberRepository.save({
      name: faker.person.fullName(),
      mail: faker.internet.email(),
      birthdate: new Date(),
    });

    const updatedClub = await service.addMemberToClub(club.id, newMember.id);
    expect(updatedClub.members).toContainEqual(newMember);
  });

  it('addMemberToClub should throw an exception for a non-existing club', async () => {
    const newMember: Member = membersList[0];
    await expect(
      service.addMemberToClub('invalid-club-id', newMember.id),
    ).rejects.toHaveProperty('message', 'El club no existe');
  });

  it('addMemberToClub should throw an exception for a non-existing member', async () => {
    await expect(
      service.addMemberToClub(club.id, 'invalid-member-id'),
    ).rejects.toHaveProperty('message', 'El socio no existe');
  });

  it('findMembersFromClub should return all members from the club', async () => {
    const members = await service.findMembersFromClub(club.id);
    expect(members).toHaveLength(membersList.length);
  });

  it('findMembersFromClub should throw an exception for a non-existing club', async () => {
    await expect(
      service.findMembersFromClub('invalid-club-id'),
    ).rejects.toHaveProperty('message', 'El club no existe');
  });

  it('findMemberFromClub should return a specific member from the club', async () => {
    const member = membersList[0];
    const foundMember = await service.findMemberFromClub(club.id, member.id);
    expect(foundMember).toEqual(member);
  });

  it('findMemberFromClub should throw an exception if the club does not exist', async () => {
    const member = membersList[0];
    await expect(
      service.findMemberFromClub('invalid-club-id', member.id),
    ).rejects.toHaveProperty('message', 'El club no existe');
  });

  it('findMemberFromClub should throw an exception if the member is not part of the club', async () => {
    const newMember: Member = await memberRepository.save({
      name: faker.person.fullName(),
      mail: faker.internet.email(),
      birthdate: new Date(),
    });

    await expect(
      service.findMemberFromClub(club.id, newMember.id),
    ).rejects.toHaveProperty('message', 'El socio no es parte del club');
  });

  it('deleteMemberFromClub should remove a member from the club', async () => {
    const member = membersList[0];
    await service.deleteMemberFromClub(club.id, member.id);

    const updatedClub = await clubRepository.findOne({
      where: { id: club.id },
      relations: ['members'],
    });
    expect(updatedClub.members).not.toContainEqual(member);
  });

  it('deleteMemberFromClub should throw an exception if the club does not exist', async () => {
    const member = membersList[0];
    await expect(
      service.deleteMemberFromClub('invalid-club-id', member.id),
    ).rejects.toHaveProperty('message', 'El club no existe');
  });

  it('deleteMemberFromClub should throw an exception if the member is not part of the club', async () => {
    const newMember: Member = await memberRepository.save({
      name: faker.person.fullName(),
      mail: faker.internet.email(),
      birthdate: new Date(),
    });

    await expect(
      service.deleteMemberFromClub(club.id, newMember.id),
    ).rejects.toHaveProperty('message', 'El socio no es parte del club');
  });

  it('should update the members of a club', async () => {
    const newMembers: Member[] = [];
    for (let i = 0; i < 3; i++) {
      const newMember: Member = await memberRepository.save({
        name: faker.person.fullName(),
        mail: faker.internet.email(),
        birthdate: new Date(),
      });
      newMembers.push(newMember);
    }

    const memberIds = newMembers.map((m) => m.id);
    const updatedClub = await service.updateMembersFromClub(club.id, memberIds);

    expect(updatedClub.members).toHaveLength(newMembers.length);
    expect(updatedClub.members).toEqual(expect.arrayContaining(newMembers));
  });

  it('should throw an exception if the club does not exist', async () => {
    const memberIds = membersList.map((m) => m.id);

    await expect(
      service.updateMembersFromClub('invalid-club-id', memberIds),
    ).rejects.toHaveProperty('message', 'El club no existe');
  });

  it('should throw an exception if one or more members do not exist', async () => {
    const invalidMemberId = 'invalid-member-id';
    const memberIds = [...membersList.map((m) => m.id), invalidMemberId];

    await expect(
      service.updateMembersFromClub(club.id, memberIds),
    ).rejects.toHaveProperty('message', 'Uno de los socios no existe');
  });
});
