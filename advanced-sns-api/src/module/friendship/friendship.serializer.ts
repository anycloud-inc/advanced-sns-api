import * as openapi from 'mio-openapi-server-interface'
import { userSerializer } from '../user/user.serializer'
import { Friendship } from './friendship.entity'

export const friendshipSerializer = {
  build: (
    item: Friendship
  ): openapi.components['schemas']['EntityFriendship'] => {
    return {
      ...item,
      id: item.id!,
      circle: item.circle,
      friend:
        item.friend != null ? userSerializer.build(item.friend) : undefined,
    }
  },

  buildFriend: (
    item: Friendship
  ): openapi.components['schemas']['EntityFriend'] => {
    return {
      ...userSerializer.build(item.friend),
      meta: {
        circle: item.circle,
        closeness: item.closeness,
      },
    }
  },
}
