import { userSerializer } from '../user/user.serializer'
import { Friendship } from './friendship.entity'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const friendshipSerializer = {
  build: (
    item: Friendship
  ): openapi.components['schemas']['EntityFriendship'] => {
    return {
      ...item,
      id: item.id!,
      friend:
        item.friend != null ? userSerializer.build(item.friend) : undefined,
    }
  },

  buildFriend: (
    item: Friendship
  ): openapi.components['schemas']['EntityUser'] => {
    return {
      ...userSerializer.build(item.friend),
    }
  },
}
