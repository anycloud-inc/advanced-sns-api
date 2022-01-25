import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Post } from 'src/lib/controller'
import { messageReactionPolicy } from './message-reaction.policy'
import { messageReactionSerializer } from './message-reaction.serializer'
import { messageReactionService } from './message-reaction.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/message_reactions')
export class MessageReactionController {
  @Post()
  @Auth
  async create(
    req: Request<
      {},
      {},
      openapi.operations['createMessageReaction']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponseMessageReaction']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
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
  async delete(
    req: Request<
      openapi.operations['deleteMessageReaction']['parameters']['path']
    >,
    res: Response<
      openapi.components['responses']['ResponseSuccess']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      await messageReactionPolicy.deletableOrFail(
        req.params.id,
        req.currentUser.id!
      )
      messageReactionService.delete({
        messageReactionId: req.params.id,
        user: req.currentUser,
      })
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
