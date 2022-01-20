import { getRepository, In } from 'typeorm'
import { Friendship } from '../friendship/friendship.entity'
import { User } from '../user/user.entity'

export const friendService = {
  async find(userId: number) {
    return await getRepository(User).find({
      id: In(await friendService.getFriendIds(userId)),
    })
  },

  async getFriendIds(userId: number) {
    const friendships = await getRepository(Friendship)
      .createQueryBuilder()
      .where({ userId })
      .getMany()

    return friendships.map(x => x.friendId)
  },
}
