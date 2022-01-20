import { getRepository } from 'typeorm'
import { FriendRequest, Status } from './friend-request.entity'

export const friendRequestPolicy = {
  async deletableOrFail(friendRequestId: number, userId: number) {
    return await getRepository(FriendRequest).findOneOrFail({
      id: friendRequestId,
      senderId: userId,
      status: Status.Requesting,
    })
  },
}
