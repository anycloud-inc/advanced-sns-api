import * as openapi from 'mio-openapi-server-interface'
import { userSerializer } from '../user/user.serializer'
import { postSerializer } from './post.serializer'
import { TimelineByPerson } from './timeline.service'

export const timelineSerializer = {
  build: (
    item: TimelineByPerson
  ): openapi.components['schemas']['EntityTimeline'] => {
    return {
      ...item,
      user: userSerializer.build(item.user),
      posts: item.posts.map(x => postSerializer.build(x)),
    }
  },
}
