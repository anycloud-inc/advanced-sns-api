import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get } from 'src/lib/controller'
import { getRepository } from 'typeorm'
import { Friendship } from '../friendship/friendship.entity'
import { friendshipSerializer } from '../friendship/friendship.serializer'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/friends')
export class FriendController {
  @Get()
  @Auth
  async index(
    req: Request<{}, {}, {}, {}>,
    res: Response<
      openapi.paths['/friends']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const friendships = await getRepository(Friendship).find({
        where: { userId: req.currentUser.id! },
        relations: ['friend'],
      })
      res.json({
        friends: friendships.map(x => friendshipSerializer.buildFriend(x)),
      })
    } catch (e) {
      next(e)
    }
  }
}
