import { IsNotEmpty } from 'class-validator'
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { IsValidReceiver } from './friend-request.validator'

export enum Status {
  Requesting = 'Requesting',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  senderId!: number

  @Column()
  @IsNotEmpty()
  @IsValidReceiver({
    message: 'Invalid receiver id',
  })
  receiverId!: number

  @Column('enum', {
    enum: Status,
    default: Status.Requesting,
  })
  status!: Status

  @ManyToOne(() => User, user => user.sendingFriendRequests)
  @Index()
  sender!: User

  @ManyToOne(() => User, user => user.receivingFriendRequests)
  @Index()
  receiver!: User

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date

  @DeleteDateColumn()
  readonly deletedAt?: Date
}
