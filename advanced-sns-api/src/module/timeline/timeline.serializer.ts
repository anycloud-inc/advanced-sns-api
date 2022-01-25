import { userSerializer } from '../user/user.serializer'
import { postSerializer } from '../post/post.serializer'
import { TimelineByPerson } from './timeline.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

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
