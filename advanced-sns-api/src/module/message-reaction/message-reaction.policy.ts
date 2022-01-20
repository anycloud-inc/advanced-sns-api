import { getRepository } from 'typeorm'
import { MessageReaction } from './message-reaction.entity'

export const messageReactionPolicy = {
  async deletableOrFail(reactionId: number, userId: number) {
    await getRepository(MessageReaction).findOneOrFail({
      id: reactionId,
      userId,
    })
  },
}
