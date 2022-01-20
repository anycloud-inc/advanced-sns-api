import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get } from 'src/lib/controller'
import { getPaginationParams } from 'src/lib/request-utils'
import { userSerializer } from './user.serializer'
import { FindParams, userService } from './user.service'

@Controller('/users')
export class UserController {
  @Get()
  @Auth
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.find(
        req.query.filter as FindParams,
        getPaginationParams(req.query)
      )
      res.json({
        users: users
          // 自分自身を検索結果から外す
          .filter(x => x.id !== req.currentUser.id!)
          .map(x => userSerializer.build(x)),
      })
    } catch (e) {
      next(e)
    }
  }

  @Get('/:id(\\d+)')
  @Auth
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findOneWithMetadata(
        parseInt(req.params.id)
      )

      res.json({
        user: userSerializer.build(user),
      })
    } catch (e) {
      next(e)
    }
  }
}
