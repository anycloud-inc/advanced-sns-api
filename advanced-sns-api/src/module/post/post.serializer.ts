import { Post } from './post.entity'
import { userSerializer } from '../user/user.serializer'
import { postViewableSerializer } from '../post-viewable/post-viewable.serializer'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'
import dayjs = require('dayjs')
import { messageSerializer } from '../message/message.serializer'
import { postSeenLogSerializer } from '../post-seen-log/post-seen-log.serializer'

export const postSerializer = {
  build: (item: Post): openapi.components['schemas']['EntityPost'] => {
    return {
      ...item,
      id: item.id!,
      user: item.user ? userSerializer.build(item.user) : undefined,
      createdAt: dayjs(item.createdAt).format(),
      viewables: item.viewables?.map(x => postViewableSerializer.build(x)),
      seenLogs: item.seenLogs?.map(x => postSeenLogSerializer.build(x)),
      messages: item.messages?.map(x => messageSerializer.build(x)),
    }
  },
}
