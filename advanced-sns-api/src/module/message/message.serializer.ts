import { postSerializer } from '../post/post.serializer'
import { userSerializer } from '../user/user.serializer'
import { Message } from './message.entity'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'
import dayjs = require('dayjs')
import { messageReactionSerializer } from '../message-reaction/message-reaction.serializer'

export const messageSerializer = {
  build: (item: Message): openapi.components['schemas']['EntityMessage'] => {
    return {
      ...item,
      id: item.id!,
      createdAt: dayjs(item.createdAt!).format(),
      updatedAt: dayjs(item.updatedAt!).format(),
      user: item.user ? userSerializer.build(item.user) : undefined,
      post: item.post ? postSerializer.build(item.post) : undefined,
      messageReactions: item.messageReactions?.map(x =>
        messageReactionSerializer.build(x)
      ),
    }
  },
}
