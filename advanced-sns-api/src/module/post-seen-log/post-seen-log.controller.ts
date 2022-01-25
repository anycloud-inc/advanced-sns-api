import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Post } from 'src/lib/controller'
import { getConnection, getRepository } from 'typeorm'
import { PostSeenLog } from './post-seen-log.entity'
import { postSeenLogSerializer } from './post-seen-log.serializer'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/post_seen_logs')
export class PostSeenLogController {
  @Post()
  @Auth
  async create(
    req: Request<
      {},
      {},
      openapi.operations['createPostSeenLog']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.paths['/post_seen_logs']['post']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const postIds: number[] = req.body.postIds
      const logs = postIds.map(postId =>
        getRepository(PostSeenLog).create({
          userId: req.currentUser.id,
          postId,
        })
      )

      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(PostSeenLog)
        .values(logs)
        .execute()

      const postSeenLogs = await getRepository(PostSeenLog).findByIds(
        result.identifiers.map(x => x.id)
      )

      res.json({
        postSeenLogs: postSeenLogs.map(item =>
          postSeenLogSerializer.build(item)
        ),
      })
    } catch (e) {
      next(e)
    }
  }
}
