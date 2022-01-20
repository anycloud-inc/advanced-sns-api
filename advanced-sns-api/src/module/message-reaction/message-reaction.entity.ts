import { IsNotEmpty } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { User } from '../user/user.entity'
import { IsValidMessage } from './message-reaction.validator'

@Entity()
export class MessageReaction {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  content!: string

  @Column()
  @IsValidMessage({ message: 'invalid messageId' })
  messageId!: number

  @ManyToOne(_ => Message, obj => obj.messageReactions, {
    onDelete: 'CASCADE',
  })
  @Index()
  message?: Message

  @Column({ nullable: true })
  userId?: number

  @ManyToOne(_ => User, obj => obj.messageReactions, { onDelete: 'CASCADE' })
  @Index()
  user?: User

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date

  @DeleteDateColumn()
  readonly deletedAt?: Date
}
