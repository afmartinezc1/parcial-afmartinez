import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
  ) {}
  async create(createClubDto: CreateClubDto) {
    //validate description max length 100
    if (createClubDto.description.length > 100) {
      throw new PreconditionFailedException(
        'La descripción es demasiado larga (100 caracteres maximos)',
      );
    }
    return this.clubRepository.save(createClubDto);
  }

  async findAll() {
    return this.clubRepository.find();
  }

  async findOne(id: string) {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto) {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    return this.clubRepository.save({ ...club, ...updateClubDto });
  }

  async remove(id: string) {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) {
      throw new NotFoundException('El club no existe');
    }
    return this.clubRepository.remove(club);
  }
}
