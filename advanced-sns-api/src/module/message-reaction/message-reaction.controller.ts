import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Post } from 'src/lib/controller'
import { messageReactionPolicy } from './message-reaction.policy'
import { messageReactionSerializer } from './message-reaction.serializer'
import { messageReactionService } from './message-reaction.service'

@Controller('/message_reactions')
export class MessageReactionController {
  @Post()
  @Auth
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messageReaction = await messageReactionService.create({
        content: req.body.content,
        messageId: req.body.messageId,
        user: req.currentUser,
      })
      res.json({
        messageReaction: messageReactionSerializer.build(messageReaction),
      })
    } catch (e) {
      next(e)
    }
  }

  @Delete('/:id')
  @Auth
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messageReactionId = parseInt(req.params.id)
      await messageReactionPolicy.deletableOrFail(
        messageReactionId,
        req.currentUser.id!
      )
      messageReactionService.delete({
        messageReactionId,
        user: req.currentUser,
      })
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
