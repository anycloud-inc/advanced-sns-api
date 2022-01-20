import { leftJoinRelations, loadRelations } from 'src/lib/typeorm-helper'
import {
  createQueryBuilder,
  getRepository,
  In,
  SelectQueryBuilder,
} from 'typeorm'
import { friendService } from '../friend/friend.service'
import { Message } from '../message/message.entity'
import { Room } from '../room/room.entity'
import { roomService } from '../room/room.service'
import { User } from '../user/user.entity'
import { Post } from '../post/post.entity'
import { postService } from '../post/post.service'

export interface FilterParams {
  userIds?: number[]
}

export interface TimelineByPerson {
  user: User
  posts: Post[]
  latestPostedAt: Date
}

export const timelineService = {
  async findByEachPerson(userId: number): Promise<TimelineByPerson[]> {
    const friends = await friendService.find(userId)
    const friendIds = friends.map(x => x.id!)
    if (friendIds.length === 0) return []
    const userPostsMap = await this._getPostsByEachPerson(userId, friendIds)
    const latestPostedAtMap = await this._getLatestPostedAtMap(
      userId,
      friendIds
    )
    const result = friends.map(friend => ({
      user: friend,
      posts: userPostsMap[friend.id!] ?? [],
      latestPostedAt: latestPostedAtMap[friend.id!] ?? new Date(1970, 1, 1),
    }))
    return this._orderTimelineItems(result)
  },

  _orderTimelineItems(items: TimelineByPerson[]): TimelineByPerson[] {
    const isUnread = (item: TimelineByPerson) => {
      return item.posts[0]?.seenLogs!.length === 0
    }
    const unreadItems = items.filter(isUnread)
    const readItems = items.filter(item => !isUnread(item))

    unreadItems.sort((a, b) => {
      return a.latestPostedAt.getTime() - b.latestPostedAt.getTime()
    })
    readItems.sort((a, b) => {
      return b.latestPostedAt.getTime() - a.latestPostedAt.getTime()
    })
    return [...unreadItems, ...readItems]
  },

  async _getPostsByEachPerson(
    userId: number,
    friendIds: number[],
    { limit = 10 } = {}
  ): Promise<{ [userId: number]: Post[] }> {
    let qb = getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect(
        `post.seenLogs`,
        'seenLog',
        `seenLog.userId = :userId`,
        { userId }
      )
      .leftJoin(
        sub => {
          sub = sub
            .from(Post, 'p')
            .leftJoin(`p.seenLogs`, 'seenLog', `seenLog.userId = :userId`, {
              userId,
            })
            .leftJoin(`p.viewables`, 'viewable', `viewable.userId = :userId`, {
              userId,
            })
            .where(`p.userId IN (:friendIds)`, { friendIds })
            .andWhere(`viewable.id IS NOT NULL`)
            .select('p.id', 'id')
            .addSelect(
              'ROW_NUMBER() OVER (PARTITION BY p.userId ORDER BY p.id desc)',
              'rowNum'
            )

          return sub
        },

        'userPost',
        'userPost.id = post.id'
      )
      .where(`post.userId IN (:friendIds)`, { friendIds })
      .andWhere(`userPost.rowNum <= ${limit}`)

    qb = leftJoinRelations(qb, ['user'])
    const posts = await qb.getMany()

    await loadRelations(posts, ['messages', 'seenLogs', 'viewables'])
    return Object.fromEntries(
      friendIds.map(id => [id, posts.filter(p => p.userId === id)])
    )
  },

  async _getLatestPostedAtMap(
    userId: number,
    friendIds: number[]
  ): Promise<{ [userId: number]: Date }> {
    const result = await getRepository(Post)
      .createQueryBuilder('post')
      .select('post.userId', 'userId')
      .addSelect('max(post.createdAt)', 'latestPostedAt')
      .leftJoin(`post.viewables`, 'viewable', `viewable.userId = :userId`, {
        userId,
      })
      .where(`post.userId IN (:friendIds)`, { friendIds })
      .andWhere(`viewable.id IS NOT NULL`)
      .groupBy('post.userId')
      .getRawMany()

    return Object.fromEntries(
      result.map(x => [x['userId'], x['latestPostedAt']])
    )
  },
}
