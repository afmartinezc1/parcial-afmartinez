import { Club } from 'src/clubs/entities/club.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mail: string;

  @Column()
  birthdate: Date;

  @ManyToMany(() => Club, (club) => club.members)
  @JoinTable({
    name: 'member_club',
    joinColumn: {
      name: 'memberId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'clubId',
      referencedColumnName: 'id',
    },
  })
  clubs: Club[];
}
