import { MessageReaction } from './message-reaction.entity'

export const messageReactionSerializer = {
  build: (item: MessageReaction) => {
    return {
      ...item,
      id: item.id!,
    }
  },
}
