import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Get } from 'src/lib/controller'
import { postService } from '../post/post.service'
import { timelineSerializer } from './timeline.serializer'
import { timelineService } from './timeline.service'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/timeline')
export class TimelineController {
  @Get('/by_each_person')
  @Auth
  async by_each_person(
    req: Request<{}, {}, {}, {}>,
    res: Response<
      openapi.paths['/timeline/by_each_person']['get']['responses'][200]['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const timelines = await timelineService.findByEachPerson(
        req.currentUser.id!
      )
      const posts = timelines.flatMap(x => x.posts)
      await postService.loadOwnMessages(req.currentUser.id!, posts)
      res.json({
        timelines: timelines.map(x => timelineSerializer.build(x)),
      })
    } catch (e) {
      next(e)
    }
  }
}
