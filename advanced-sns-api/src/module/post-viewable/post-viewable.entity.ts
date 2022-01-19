import { IsNotEmpty } from 'class-validator'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  DeleteDateColumn,
} from 'typeorm'
import { Post } from '../post/post.entity'
import { User } from '../user/user.entity'

@Entity()
@Unique(['userId', 'postId'])
export class PostViewable {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  userId!: number

  @Column()
  @IsNotEmpty()
  postId!: number

  @ManyToOne(_ => Post, obj => obj.viewables, { onDelete: 'CASCADE' })
  post?: Post

  @ManyToOne(_ => User, obj => obj.postViewables)
  user?: User

  @CreateDateColumn()
  readonly createdAt?: Date

  @UpdateDateColumn()
  readonly updatedAt?: Date

  @DeleteDateColumn()
  readonly deletedAt?: Date
}
