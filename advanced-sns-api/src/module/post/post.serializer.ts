import { Post } from './post.entity'
import dayjs = require('dayjs')
import { userSerializer } from '../user/user.serializer'
import { postViewableSerializer } from '../post-viewable/post-viewable.serializer'

export const postSerializer = {
  build: (item: Post) => {
    return {
      ...item,
      id: item.id!,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt).format(),
      viewables: item.viewables?.map(x => postViewableSerializer.build(x)),
    }
  },
}
