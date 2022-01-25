import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Get } from 'src/lib/controller'
import { getRepository } from 'typeorm'
import { Friendship } from './friendship.entity'
import { friendshipSerializer } from './friendship.serializer'
import { friendshipService } from './friendship.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/friendships')
export class FriendshipController {
  @Get('/')
  @Auth
  async index(
    req: Request<{}, {}, {}, {}>,
    res: Response<
      openapi.components['responses']['ResponseFriendshipList']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const friendships = await getRepository(Friendship).find({
        userId: req.currentUser.id!,
      })
      res.json({
        friendships: friendships.map(friendship =>
          friendshipSerializer.build(friendship)
        ),
      })
    } catch (e) {
      next(e)
    }
  }

  @Delete()
  @Auth
  async delete(
    req: Request<
      {},
      {},
      openapi.operations['deleteFriendship']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponseSuccess']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      await friendshipService.deleteByUser(
        req.currentUser.id!,
        req.body.friendId
      )
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
