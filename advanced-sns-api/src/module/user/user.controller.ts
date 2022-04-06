import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get } from 'src/lib/controller'
import { getPaginationParams } from 'src/lib/request-utils'
import { userSerializer } from './user.serializer'
import { userService } from './user.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/users')
export class UserController {
  @Get()
  @Auth
  async index(
    req: Request<
      {},
      {},
      {},
      openapi.paths['/users']['get']['parameters']['query']
    >,
    res: Response<
      openapi.paths['/users']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.find(
        req.query.filter,
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
