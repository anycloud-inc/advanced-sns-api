import { IsEmail, IsNotEmpty } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { FriendRequest } from '../friend-request/friend-request.entity'
import { Friendship } from '../friendship/friendship.entity'
import { MessageReaction } from '../message-reaction/message-reaction.entity'
import { Message } from '../message/message.entity'
import { PostSeenLog } from '../post-seen-log/post-seen-log.entity'
import { PostViewable } from '../post-viewable/post-viewable.entity'
import { Post } from '../post/post.entity'
import { RoomUser } from '../room-user/room-user.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  @IsEmail()
  @Index({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  @IsNotEmpty()
  name!: string

  @Column({ nullable: true })
  iconImageUrl?: string

  @OneToMany(_ => Post, obj => obj.user)
  posts?: Post[]

  @OneToMany(() => RoomUser, obj => obj.user, { cascade: true })
  roomUsers!: RoomUser[]

  @OneToMany(_ => Message, obj => obj.user, { cascade: true })
  messages?: Message[]

  @OneToMany(_ => PostViewable, obj => obj.user)
  postViewables?: PostViewable[]

  @OneToMany(() => Friendship, obj => obj.user, { cascade: true })
  friendships?: Friendship[]

  @OneToMany(() => Friendship, obj => obj.friend, { cascade: true })
  reverseFriendships!: Friendship[]

  @OneToMany(() => FriendRequest, obj => obj.sender, { cascade: true })
  sendingFriendRequests!: FriendRequest[]

  @OneToMany(() => FriendRequest, obj => obj.receiver, { cascade: true })
  receivingFriendRequests!: FriendRequest[]

  @OneToMany(_ => PostSeenLog, obj => obj.user)
  seenLogs?: PostSeenLog[]

  @OneToMany(_ => MessageReaction, obj => obj.user)
  messageReactions?: MessageReaction[]

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date
}
