import { MessageReaction } from './message-reaction.entity'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const messageReactionSerializer = {
  build: (
    item: MessageReaction
  ): openapi.components['schemas']['EntityMessageReaction'] => {
    return {
      id: item.id!,
      content: item.content!,
      userId: item.userId!,
      messageId: item.messageId!,
    }
  },
}
