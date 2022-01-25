import { userSerializer } from '../user/user.serializer'
import { PostSeenLog } from './post-seen-log.entity'
import dayjs = require('dayjs')
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const postSeenLogSerializer = {
  build: (
    item: PostSeenLog
  ): openapi.components['schemas']['EntityPostSeenLog'] => {
    return {
      ...item,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt!).format(),
    }
  },
}
