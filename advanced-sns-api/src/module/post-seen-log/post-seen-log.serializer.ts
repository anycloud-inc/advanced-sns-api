import { userSerializer } from '../user/user.serializer'
import { PostSeenLog } from './post-seen-log.entity'
import dayjs = require('dayjs')

export const postSeenLogSerializer = {
  build: (item: PostSeenLog) => {
    return {
      ...item,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt!).format(),
    }
  },
}
