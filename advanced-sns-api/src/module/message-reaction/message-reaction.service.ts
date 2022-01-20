import { getRepository } from 'typeorm'
import { validateOrFail } from 'src/lib/validate'
import { MessageReaction } from './message-reaction.entity'
import { User } from '../user/user.entity'
import { messageService } from '../message/message.service'

interface CreateParams {
  messageId: number
  user: User
  content: string
}

interface DeleteParams {
  messageReactionId: number
  user: User
}

export const messageReactionService = {
  async create(params: CreateParams): Promise<MessageReaction> {
    const repo = getRepository(MessageReaction)
    let messageReaction = repo.create({
      ...params,
    })
    await validateOrFail(messageReaction)
    messageReaction = await repo.save(messageReaction)
    let message = await messageService.findOne(params.messageId)
    message = await messageService.touchUpdatedAt(message)

    return messageReaction
  },

  async delete(params: DeleteParams): Promise<MessageReaction> {
    const repo = getRepository(MessageReaction)
    const messageReaction = await repo.findOneOrFail(params.messageReactionId)
    const messageId = messageReaction.messageId
    repo.delete(messageReaction.id!)
    let message = await messageService.findOne(messageId)
    message = await messageService.touchUpdatedAt(message)
    return messageReaction
  },
}
