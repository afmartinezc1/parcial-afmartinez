/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';

import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';

describe('ClubsService', () => {
  let service: ClubsService;
  let clubRepository: Repository<Club>;
  let clubsList: Club[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubsService],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    clubRepository = module.get<Repository<Club>>(getRepositoryToken(Club));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await clubRepository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: Club = await clubRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(10),
        members: [],
        foundationDate: new Date(),
        image: '',
      });
      clubsList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: Club[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: Club = clubsList[0];
    const club: Club = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
    expect(club.description).toEqual(storedClub.description);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El club no existe',
    );
  });

  it('create should return a new club', async () => {
    const club: Club = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(10),
      members: [],
      foundationDate: new Date(),
      image: '',
    };

    const newClub: Club = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: Club = await clubRepository.findOne({
      where: { id: newClub.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name);
    expect(storedClub.description).toEqual(newClub.description);
  });

  it('create should throw an exception if the description is too long', async () => {
    const club: Club = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(101),
      members: [],
      foundationDate: new Date(),
      image: '',
    };

    await expect(() => service.create(club)).rejects.toHaveProperty(
      'message',
      'La descripción es demasiado larga (100 caracteres maximos)',
    );
  });

  it('update should modify a club', async () => {
    const club: Club = clubsList[0];
    club.name = 'New name';
    club.description = 'New description';

    const updatedClub: Club = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: Club = await clubRepository.findOne({
      where: { id: club.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name);
    expect(storedClub.description).toEqual(club.description);
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: Club = clubsList[0];
    club = {
      ...club,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('-1', club)).rejects.toHaveProperty(
      'message',
      'El club no existe',
    );
  });

  it('remove should delete a club', async () => {
    const club: Club = clubsList[0];
    await service.remove(club.id);

    const deletedClub: Club = await clubRepository.findOne({
      where: { id: club.id },
    });
    expect(deletedClub).toBeNull();
  });

  it('remove should throw an exception for an invalid club', async () => {
    const club: Club = clubsList[0];
    await service.remove(club.id);
    await expect(() => service.remove('0')).rejects.toHaveProperty(
      'message',
      'El club no existe',
    );
  });
});
