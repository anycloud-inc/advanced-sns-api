import { userSerializer } from '../user/user.serializer'
import { Friendship } from './friendship.entity'

export const friendshipSerializer = {
  build: (item: Friendship) => {
    return {
      ...item,
      id: item.id!,
      friend:
        item.friend != null ? userSerializer.build(item.friend) : undefined,
    }
  },

  buildFriend: (item: Friendship) => {
    return {
      ...userSerializer.build(item.friend),
    }
  },
}
