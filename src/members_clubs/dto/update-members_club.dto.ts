import { PartialType } from '@nestjs/mapped-types';
import { CreateMembersClubDto } from './create-members_club.dto';

export class UpdateMembersClubDto extends PartialType(CreateMembersClubDto) {}
