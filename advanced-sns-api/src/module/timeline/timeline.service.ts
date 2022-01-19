// import { leftJoinRelations, loadRelations } from 'src/lib/typeorm-helper'
// import {
//   createQueryBuilder,
//   getRepository,
//   In,
//   IsNull,
//   Not,
//   SelectQueryBuilder,
// } from 'typeorm'
// import { friendService } from '../friend/friend.service'
// import { Invitation } from '../invitation/invitation.entity'
// import { Message } from '../message/message.entity'
// import { Room } from '../room/room.entity'
// import { roomService } from '../room/room.service'
// import { User } from '../user/user.entity'
// import { limitedRatioThreshold, Post } from './post.entity'
// import { postService } from './post.service'
// import * as objectUtils from '../../lib/object-utils'
// import { PostForUserService } from './post-for-user.service'

// export interface FilterParams {
//   userIds?: number[]
// }

// export interface TimelineByPerson {
//   user: User
//   posts: Post[]
//   showSuggestMessageNotice: boolean
//   showUserJoinNotice: boolean
//   lockedPostCount: number
//   latestPostedAt: Date
//   hasUnreadLimited: boolean
// }

// export const timelineService = {
//   async findByEachPerson(userId: number): Promise<TimelineByPerson[]> {
//     const friends = await friendService.find(userId)
//     const friendIds = friends.map(x => x.id!)
//     if (friendIds.length === 0) return []
//     const userLockedMap = await this._getLockedCountMap(userId, friendIds)
//     const userPostsMap = await this._getPostsByEachPerson(userId, friendIds, {
//       lockedUserIds: Object.keys(userLockedMap).map(x => parseInt(x)),
//     })
//     const latestPostedAtMap = await this._getLatestPostedAtMap(
//       userId,
//       friendIds
//     )
//     const unreadLimitedMap = await this._getUnreadLimitedMap(userId, friendIds)
//     const showSuggestMessageNoticeMap = await this._getSuggestMessageNoticeMap(
//       userId
//     )
//     const invitingUserIds = (
//       await getRepository(Invitation).find({
//         userId,
//         friendId: Not(IsNull()),
//       })
//     ).map(invitation => invitation.friendId!)
//     const showUserJoinNoticeMap = objectUtils.filterBy(
//       showSuggestMessageNoticeMap,
//       (key, val) => invitingUserIds.includes(parseInt(key)) && val
//     )
//     const result = friends.map(friend => ({
//       user: friend,
//       posts: userPostsMap[friend.id!] ?? [],
//       showSuggestMessageNotice:
//         showSuggestMessageNoticeMap[friend.id!] ?? false,
//       showUserJoinNotice: showUserJoinNoticeMap[friend.id!] ?? false,
//       lockedPostCount: userLockedMap[friend.id!] ?? 0,
//       latestPostedAt: latestPostedAtMap[friend.id!] ?? new Date(1970, 1, 1),
//       hasUnreadLimited: unreadLimitedMap[friend.id!] ?? false,
//     }))
//     return this._orderTimelineItems(result)
//   },

//   _orderTimelineItems(items: TimelineByPerson[]): TimelineByPerson[] {
//     const isUnread = (item: TimelineByPerson) => {
//       if (!item.posts[0] || item.lockedPostCount > 0) return false
//       return item.posts[0].seenLogs!.length === 0
//     }
//     const unreadItems = items.filter(isUnread)
//     const readOrRockedItems = items.filter(item => !isUnread(item))

//     unreadItems.sort((a, b) => {
//       return a.latestPostedAt.getTime() - b.latestPostedAt.getTime()
//     })
//     readOrRockedItems.sort((a, b) => {
//       return b.latestPostedAt.getTime() - a.latestPostedAt.getTime()
//     })

//     return [...unreadItems, ...readOrRockedItems]
//   },

//   async _getUnreadLimitedMap(
//     userId: number,
//     friendIds: number[]
//   ): Promise<{ [userId: number]: boolean }> {
//     const result = await getRepository(Post)
//       .createQueryBuilder('p')
//       .innerJoin(`p.viewables`, 'viewable', `viewable.userId = ${userId}`)
//       .leftJoin('p.seenLogs', 'seenLog', `seenLog.userId = ${userId}`)
//       .where(`p.userId IN (:friendIds)`, { friendIds })
//       .andWhere('seenLog.id IS NULL')
//       .andWhere(`viewableRatio < ${limitedRatioThreshold}`)
//       .select('DISTINCT(p.userId)', 'userId')
//       .getRawMany()
//     return Object.fromEntries(result.map(x => [x['userId'], true]))
//   },

//   async _getLockedCountMap(
//     userId: number,
//     friendIds: number[],
//     { limit = 10 } = {}
//   ): Promise<{ [userId: number]: number }> {
//     if (friendIds.length === 0) return {}
//     // 最新既読投稿10件に1回もリアクションしていないユーザーを洗い出し、
//     // {userId, latestSeenPostId} のテーブルを作る
//     const lockedQbBuilder = (qb: SelectQueryBuilder<any>) =>
//       qb
//         .from(Post, 'post')
//         .innerJoin(
//           sub =>
//             sub
//               .from(Post, 'p')
//               .innerJoin('p.seenLogs', 'seenLog', `seenLog.userId = ${userId}`)
//               .where(`p.userId IN (:friendIds)`, { friendIds })
//               .select('p.id', 'id')
//               .addSelect(
//                 'ROW_NUMBER() OVER (PARTITION BY p.userId ORDER BY p.id desc)',
//                 'rowNum'
//               ),
//           'userPost',
//           'userPost.id = post.id'
//         )
//         .leftJoin('post.messages', 'message', `message.userId = ${userId}`)
//         .where(`userPost.rowNum <= ${limit}`)
//         .groupBy('post.userId')
//         .select('post.userId', 'userId')
//         .addSelect('MAX(post.id)', 'latestSeenPostId')
//         .addSelect('COUNT(post.id)', 'seenCount')
//         .addSelect('COUNT(message.id)', 'messageCount')
//         .having(`seenCount = ${limit}`)
//         .andHaving('messageCount = 0')

//     // ロックされているユーザーの未読数を算出
//     const result = await getRepository(User)
//       .createQueryBuilder('user')
//       .innerJoin(lockedQbBuilder, 'lockedData', 'lockedData.userId = user.id')
//       .leftJoin('user.posts', 'post')
//       .leftJoin(`post.viewables`, 'viewable', `viewable.userId = ${userId}`)
//       .where('post.id > lockedData.latestSeenPostId')
//       .andWhere('viewable.id IS NOT NULL')
//       .groupBy('user.id')
//       .select('user.id', 'userId')
//       .addSelect('COUNT(post.id)', 'lockedCount')
//       .getRawMany()

//     return Object.fromEntries(
//       result.map(x => [x['userId'], parseInt(x['lockedCount'])])
//     )
//   },

//   async _getPostsByEachPerson(
//     userId: number,
//     friendIds: number[],
//     { limit = 10, lockedUserIds = [] as number[] } = {}
//   ): Promise<{ [userId: number]: Post[] }> {
//     let qb = getRepository(Post)
//       .createQueryBuilder('post')
//       .leftJoinAndSelect(
//         `post.seenLogs`,
//         'seenLog',
//         `seenLog.userId = :userId`,
//         { userId }
//       )
//       .leftJoin(
//         sub => {
//           sub = sub
//             .from(Post, 'p')
//             .leftJoin(`p.seenLogs`, 'seenLog', `seenLog.userId = :userId`, {
//               userId,
//             })
//             .leftJoin(`p.viewables`, 'viewable', `viewable.userId = :userId`, {
//               userId,
//             })
//             .where(`p.userId IN (:friendIds)`, { friendIds })
//             .andWhere(`viewable.id IS NOT NULL`)
//             .andWhere(`(p.hiddenAt > :now OR p.hiddenAt IS NULL)`, {
//               now: new Date(),
//             })
//             .select('p.id', 'id')
//             .addSelect(
//               'ROW_NUMBER() OVER (PARTITION BY p.userId ORDER BY p.id desc)',
//               'rowNum'
//             )

//           if (lockedUserIds.length > 0) {
//             // ロックされているユーザーは既読投稿のみ取得
//             sub = sub.andWhere(
//               `(p.userId NOT IN (:lockedUserIds) OR seenLog.id IS NOT NULL)`,
//               { lockedUserIds }
//             )
//           }

//           return sub
//         },

//         'userPost',
//         'userPost.id = post.id'
//       )
//       .where(`post.userId IN (:friendIds)`, { friendIds })
//       .andWhere(`userPost.rowNum <= ${limit}`)

//     qb = leftJoinRelations(qb, postService.toOneContents())
//     const posts = await qb.getMany()

//     await loadRelations(posts, postService.toManyContents())
//     await new PostForUserService(userId).loadQuotes(posts)
//     await new PostForUserService(userId).loadQuestionViewables(posts)
//     await postService.loadRecommendedMessages(posts)
//     return Object.fromEntries(
//       friendIds.map(id => [id, posts.filter(p => p.userId === id)])
//     )
//   },

//   async _getLatestPostedAtMap(
//     userId: number,
//     friendIds: number[]
//   ): Promise<{ [userId: number]: Date }> {
//     const result = await getRepository(Post)
//       .createQueryBuilder('post')
//       .select('post.userId', 'userId')
//       .addSelect('max(post.createdAt)', 'latestPostedAt')
//       .leftJoin(`post.viewables`, 'viewable', `viewable.userId = :userId`, {
//         userId,
//       })
//       .where(`post.userId IN (:friendIds)`, { friendIds })
//       .andWhere(`viewable.id IS NOT NULL`)
//       .groupBy('post.userId')
//       .getRawMany()

//     return Object.fromEntries(
//       result.map(x => [x['userId'], x['latestPostedAt']])
//     )
//   },

//   async _getSuggestMessageNoticeMap(
//     userId: number
//   ): Promise<{ [userId: number]: boolean }> {
//     const friendIds = await friendService.getFriendIds(userId)
//     const usersIdList = friendIds.map(friendId =>
//       roomService._getUsersId([userId, friendId])
//     )
//     const rooms = await getRepository(Room).find({ usersId: In(usersIdList) })
//     if (rooms.length === 0) return {}
//     const messageCountMaps = await createQueryBuilder()
//       .select('message.roomId', 'roomId')
//       .addSelect('count(*)', 'count')
//       .from(Message, 'message')
//       .where('message.roomId IN (:...roomIds)', {
//         roomIds: rooms.map(room => room.id),
//       })
//       .groupBy('message.roomId')
//       .getRawMany()

//     return Object.fromEntries(
//       friendIds.map(friendId => {
//         const room = rooms.find(
//           r => r.usersId === roomService._getUsersId([userId, friendId])
//         )
//         if (!room) return [friendId, true]
//         const messageCountMap = messageCountMaps.find(
//           map => map.roomId === room.id
//         )
//         if (!messageCountMap) return [friendId, true]
//         return [friendId, messageCountMap === 0]
//       })
//     )
//   },
// }
