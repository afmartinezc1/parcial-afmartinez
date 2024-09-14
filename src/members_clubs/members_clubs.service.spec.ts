import { Test, TestingModule } from '@nestjs/testing';
import { MembersClubsService } from './members_clubs.service';

describe('MembersClubsService', () => {
  let service: MembersClubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersClubsService],
    }).compile();

    service = module.get<MembersClubsService>(MembersClubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
