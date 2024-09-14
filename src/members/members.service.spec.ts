import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';

describe('MembersService', () => {
  let service: MembersService;
  let memberRepository: Repository<Member>;
  let membersList: Member[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
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
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const members: Member[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(membersList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMember: Member = membersList[0];
    const member: Member = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.name).toEqual(storedMember.name);
    expect(member.mail).toEqual(storedMember.mail);
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El socio no existe',
    );
  });

  it('create should return a new member', async () => {
    const createMemberDto: CreateMemberDto = {
      name: faker.person.fullName(),
      mail: 'valid.email@example.com',
      birthdate: new Date(),
    };

    const newMember: Member = await service.create(createMemberDto);
    expect(newMember).not.toBeNull();

    const storedMember: Member = await memberRepository.findOne({
      where: { id: newMember.id },
    });
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(newMember.name);
    expect(storedMember.mail).toEqual(newMember.mail);
  });

  it('create should throw an exception if email is invalid', async () => {
    const createMemberDto: CreateMemberDto = {
      name: faker.person.fullName(),
      mail: 'invalid-email',
      birthdate: new Date(),
    };

    await expect(() => service.create(createMemberDto)).rejects.toHaveProperty(
      'message',
      'El mail no es valido, debe tener al menos un @ y un .',
    );
  });

  it('update should modify a member', async () => {
    const member: Member = membersList[0];
    const updateMemberDto: UpdateMemberDto = {
      name: 'New Name',
      mail: 'new.email@example.com',
    };

    const updatedMember: Member = await service.update(
      member.id,
      updateMemberDto,
    );
    expect(updatedMember).not.toBeNull();

    const storedMember: Member = await memberRepository.findOne({
      where: { id: member.id },
    });
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(updateMemberDto.name);
    expect(storedMember.mail).toEqual(updateMemberDto.mail);
  });

  it('update should throw an exception for an invalid member', async () => {
    const updateMemberDto: UpdateMemberDto = {
      name: 'New Name',
      mail: 'new.email@example.com',
    };

    await expect(() =>
      service.update('0', updateMemberDto),
    ).rejects.toHaveProperty('message', 'El socio no existe');
  });

  it('remove should delete a member', async () => {
    const member: Member = membersList[0];
    await service.remove(member.id);

    const deletedMember: Member = await memberRepository.findOne({
      where: { id: member.id },
    });
    expect(deletedMember).toBeNull();
  });

  it('remove should throw an exception for an invalid member', async () => {
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'El socio no existe',
    );
  });
});
