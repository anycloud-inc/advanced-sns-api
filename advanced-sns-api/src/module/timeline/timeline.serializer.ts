import { userSerializer } from '../user/user.serializer'
import { postSerializer } from '../post/post.serializer'
import { TimelineByPerson } from './timeline.service'

export const timelineSerializer = {
  build: (item: TimelineByPerson) => {
    return {
      ...item,
      user: userSerializer.build(item.user),
      posts: item.posts.map(x => postSerializer.build(x)),
    }
  },
}
