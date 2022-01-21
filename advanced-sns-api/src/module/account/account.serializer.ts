import { Status } from '../friend-request/friend-request.entity'
import { User } from '../user/user.entity'

export const accountSerializer = {
  build(user: User) {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      iconImageUrl: user.iconImageUrl,
      friendIds: user.friendships!.map(friendship => friendship.friendId),
      sendingRequestUserIds: user.sendingFriendRequests
        ?.filter(x => x.status === Status.Requesting)
        .map(x => x.receiverId),
      receivingRequestUserIds: user.receivingFriendRequests
        ?.filter(x => x.status === Status.Requesting)
        .map(x => x.senderId),
    }
  },
}
