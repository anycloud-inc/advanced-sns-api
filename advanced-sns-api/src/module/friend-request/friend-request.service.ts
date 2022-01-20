import { addPagination, PaginationParams } from 'src/lib/typeorm-helper'
import { validateOrFail } from 'src/lib/validate'
import { getManager, getRepository } from 'typeorm'
import { friendshipService } from '../friendship/friendship.service'
import { FriendRequest, Status } from './friend-request.entity'

export const friendRequestService = {
  async getSendingRequests(userId: number, pagination: PaginationParams) {
    let qb = getRepository(FriendRequest).createQueryBuilder()
    qb = qb
      .leftJoinAndSelect(`${qb.alias}.receiver`, 'receiver')
      .where({ senderId: userId, status: Status.Requesting })
    qb = addPagination(qb, pagination)
    return await qb.getMany()
  },

  async getReceivingRequests(
    userId: number,
    pagination: PaginationParams
  ): Promise<[FriendRequest[], number]> {
    let qb = getRepository(FriendRequest).createQueryBuilder()
    qb = qb
      .leftJoinAndSelect(`${qb.alias}.sender`, 'sender')
      .where({ receiverId: userId, status: Status.Requesting })
    const count = await qb.getCount()
    qb = addPagination(qb, pagination)
    return [await qb.getMany(), count]
  },

  async create(senderId: number, receiverId: number): Promise<FriendRequest> {
    const repo = getRepository(FriendRequest)
    let friendRequest = repo.create({
      senderId,
      receiverId,
      status: Status.Requesting,
    })
    await this.validate(friendRequest)
    friendRequest = await repo.save(friendRequest)

    return friendRequest
  },

  async accept(senderId: number, receiverId: number) {
    const repo = getRepository(FriendRequest)
    let friendRequest = await repo.findOneOrFail({
      senderId,
      receiverId,
      status: Status.Requesting,
    })
    friendRequest.status = Status.Accepted
    await this.validate(friendRequest)

    friendRequest = await getManager().transaction(async entityManager => {
      friendRequest = await entityManager.save(friendRequest)
      await friendshipService.createFriendship(
        {
          userId: friendRequest.senderId,
          friendId: friendRequest.receiverId,
        },
        entityManager
      )
      return friendRequest
    })

    return friendRequest
  },

  async decline(senderId: number, receiverId: number) {
    const repo = getRepository(FriendRequest)
    let friendRequest = await repo.findOneOrFail({
      senderId,
      receiverId,
      status: Status.Requesting,
    })
    friendRequest.status = Status.Declined
    return await repo.save(friendRequest)
  },

  async validate(friendRequest: FriendRequest) {
    await validateOrFail(friendRequest)
  },
}
