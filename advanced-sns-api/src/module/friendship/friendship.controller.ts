import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Get } from 'src/lib/controller'
import { getRepository } from 'typeorm'
import { Friendship } from './friendship.entity'
import { friendshipSerializer } from './friendship.serializer'
import { friendshipService } from './friendship.service'

@Controller('/friendships')
export class FriendshipController {
  @Get('/')
  @Auth
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
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
