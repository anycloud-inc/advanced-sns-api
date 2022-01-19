import { getRepository } from 'typeorm'
import { Friendship } from '../friendship/friendship.entity'

export const friendshipPolicy = {
  async updatableOrFail(friendshipId: number, userId: number) {
    await getRepository(Friendship).findOneOrFail({
      id: friendshipId,
      friendId: userId,
    })
  },
}
