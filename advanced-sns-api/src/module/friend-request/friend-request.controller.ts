import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Get, Patch, Post } from 'src/lib/controller'
import {
  checkEnumParameterOrFail,
  getPaginationParams,
} from 'src/lib/request-utils'
import { getRepository } from 'typeorm'
import { FriendRequest, Status } from './friend-request.entity'
import { friendRequestSerializer } from './friend-request.serializer'
import { friendRequestService } from './friend-request.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/friend_requests')
export class FriendRequestController {
  @Get('/receiving')
  @Auth
  async receiving(
    req: Request<
      {},
      {},
      {},
      openapi.paths['/friend_requests/receiving']['get']['parameters']['query']
    >,
    res: Response<
      openapi.paths['/friend_requests/receiving']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ) {
    try {
      const [requests, count] = await friendRequestService.getReceivingRequests(
        req.currentUser.id!,
        getPaginationParams(req.query)
      )
      res.json({
        friendRequests: requests.map(x => friendRequestSerializer.build(x)),
        totalCount: count,
      })
    } catch (e) {
      next(e)
    }
  }

  @Post()
  @Auth
  async create(
    req: Request<
      {},
      {},
      openapi.paths['/friend_requests']['post']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/friend_requests']['post']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ) {
    try {
      await friendRequestService.create(
        req.currentUser.id!,
        req.body.receiverId
      )
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }

  @Patch('/status')
  @Auth
  async updateStatus(
    req: Request<
      {},
      {},
      openapi.paths['/friend_requests/status']['patch']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/friend_requests/status']['patch']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ) {
    try {
      checkEnumParameterOrFail(req.body, { status: Status })
      const senderId = req.body.senderId
      const status = req.body.status as Status

      if (status === Status.Accepted) {
        await friendRequestService.accept(senderId, req.currentUser.id!)
      } else if (status === Status.Declined) {
        await friendRequestService.decline(senderId, req.currentUser.id!)
      }

      res.json({ success: true })
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
      openapi.paths['/friend_requests']['delete']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/friend_requests']['delete']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ) {
    try {
      const repo = getRepository(FriendRequest)
      const request = await repo.findOneOrFail({
        senderId: req.currentUser.id!,
        receiverId: req.body.receiverId,
        status: Status.Requesting,
      })
      await repo.delete(request.id!)
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}
