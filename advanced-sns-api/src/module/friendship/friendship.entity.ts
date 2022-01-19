import { IsNotEmpty } from 'class-validator'
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { User } from '../user/user.entity'
import { IsValidFriend } from './friendship.validator'

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  userId!: number

  @Column()
  @IsNotEmpty()
  @IsValidFriend({ message: 'Invalid friend id' })
  friendId!: number

  @Column({ default: 0 })
  level!: number

  @ManyToOne(() => User, user => user.friendships, { onDelete: 'CASCADE' })
  @Index()
  user!: User

  @ManyToOne(() => User, user => user.reverseFriendships, {
    onDelete: 'CASCADE',
  })
  @Index()
  friend!: User

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
