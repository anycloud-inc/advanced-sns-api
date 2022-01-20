import dayjs = require('dayjs')
import { userSerializer } from '../user/user.serializer'
import { FriendRequest } from './friend-request.entity'

export const friendRequestSerializer = {
  build: (item: FriendRequest) => {
    return {
      id: item.id!,
      senderId: item.senderId,
      receiverId: item.receiverId,
      sender:
        item.sender != null ? userSerializer.build(item.sender) : undefined,
      receiver:
        item.receiver != null ? userSerializer.build(item.receiver) : undefined,
      createdAt: dayjs(item.createdAt).format(),
    }
  },
}
