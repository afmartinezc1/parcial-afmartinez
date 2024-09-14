import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}
  async create(createMemberDto: CreateMemberDto) {
    //validate mail
    const regExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!regExp.test(createMemberDto.mail)) {
      throw new PreconditionFailedException(
        'El mail no es valido, debe tener al menos un @ y un .',
      );
    }
    return this.memberRepository.save(createMemberDto);
  }

  async findAll() {
    return this.memberRepository.find();
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('El socio no existe');
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('El socio no existe');
    }
    return this.memberRepository.save({ ...member, ...updateMemberDto });
  }

  async remove(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('El socio no existe');
    }
    return this.memberRepository.remove(member);
  }
}
