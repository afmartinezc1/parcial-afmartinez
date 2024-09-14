import { Member } from '../../members/entities/member.entity';
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from 'typeorm';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  foundationDate: Date;

  @Column()
  image: string;

  @Column()
  description: string;

  @ManyToMany(() => Member, (member) => member.clubs)
  members: Member[];
}
