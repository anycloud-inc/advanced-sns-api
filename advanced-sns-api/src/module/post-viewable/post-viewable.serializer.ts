import { PostViewable } from './post-viewable.entity'
import dayjs = require('dayjs')

export const postViewableSerializer = {
  build: (item: PostViewable) => {
    return {
      ...item,
      id: item.id!,
      createdAt: dayjs(item.createdAt!).format(),
    }
  },
}
