import { MessageReaction } from './message-reaction.entity'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const messageReactionSerializer = {
  build: (
    item: MessageReaction
  ): openapi.components['schemas']['EntityMessageReaction'] => {
    return {
      ...item,
      id: item.id!,
    }
  },
}
