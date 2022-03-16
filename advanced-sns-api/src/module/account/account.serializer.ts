import { Status } from '../friend-request/friend-request.entity'
import { User } from '../user/user.entity'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const accountSerializer = {
  build(user: User): openapi.components['schemas']['EntityAccount'] {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      iconImageUrl: user.iconImageUrl,
      friendIds: user.friendships?.map(friendship => friendship.friendId) ?? [],
      sendingRequestUserIds: user.sendingFriendRequests
        ?.filter(x => x.status === Status.Requesting)
        .map(x => x.receiverId),
      receivingRequestUserIds: user.receivingFriendRequests
        ?.filter(x => x.status === Status.Requesting)
        .map(x => x.senderId),
    }
  },
}
