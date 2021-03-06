import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Patch, Post } from 'src/lib/controller'
import { authService } from 'src/module/auth/auth.service'
import { accountSerializer } from './account.serializer'
import { Auth } from 'src/lib/auth'
import { accountService } from './account.service'
import { upload } from 'src/lib/image-uploader'
import { loadRelations } from 'src/lib/typeorm-helper'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/account')
export class AccountController {
  @Get()
  async show(
    req: Request<{}, {}, {}, {}>,
    res: Response<
      openapi.paths['/account']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    const currentUser = req.currentUser
    if (currentUser == null) {
      res.json({ user: undefined })
      return
    }
    await loadRelations(
      [currentUser],
      ['friendships', 'sendingFriendRequests', 'receivingFriendRequests']
    )
    res.json({
      user: accountSerializer.build(currentUser),
    })
  }

  @Post()
  async create(
    req: Request<
      {},
      {},
      openapi.operations['createAccount']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponseSignIn']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body
      const { user, token } = await authService.signup({
        name,
        email,
        password,
      })
      res.json({ user: accountSerializer.build(user), token })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Patch('/icon_image')
  async updateIconImage(
    req: Request<
      openapi.operations['updateIconImage']['requestBody']['content']['multipart/form-data']
    >,
    res: Response<
      openapi.paths['/account/icon_image']['patch']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const { url } = await upload(req, res, 'users/icon')
      const account = await accountService.saveAccount(req.currentUser, {
        iconImageUrl: url,
      })
      res.json({ user: accountSerializer.build(account) })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Patch('/profile')
  async updateProfile(
    req: Request<
      {},
      {},
      openapi.operations['updateProfile']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/account/profile']['patch']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const account = await accountService.saveAccount(req.currentUser, {
        name: req.body.name,
        email: req.body.email,
      })
      res.json({ user: accountSerializer.build(account) })
    } catch (e) {
      next(e)
    }
  }
}
