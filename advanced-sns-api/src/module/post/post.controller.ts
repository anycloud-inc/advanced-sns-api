import { Request, Response, NextFunction } from 'express'
import { Auth } from 'src/lib/auth'
import { Controller, Delete, Get, Patch, Post } from 'src/lib/controller'
import { postSerializer } from './post.serializer'
import { postService } from './post.service'
import { Post as PostEntity } from './post.entity'
import { getRepository } from 'typeorm'
import { postPolicy } from './post.policy'
import {
  checkParameterOrFail,
  getPaginationParams,
} from 'src/lib/request-utils'
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

@Controller('/posts')
export class PostController {
  @Get()
  @Auth
  async index(
    req: Request<
      {},
      {},
      {},
      openapi.paths['/posts']['get']['parameters']['query']
    >,
    res: Response<
      openapi.components['responses']['ResponsePostList']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const posts = await postService.find({
        filter: req.query.filter,
        pagination: getPaginationParams(req.query),
      })
      res.json({
        posts: posts.map(post => postSerializer.build(post)),
      })
    } catch (e) {
      next(e)
    }
  }

  @Get('/:id(\\d+)')
  @Auth
  async show(
    req: Request<openapi.operations['findPost']['parameters']['path']>,
    res: Response<
      openapi.components['responses']['ResponsePost']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const post = await postService.findOneOrFail(
        req.currentUser.id!,
        req.params.id
      )
      await postPolicy.showableOrFail(post, req.currentUser.id!)
      res.json({ post: postSerializer.build(post) })
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
      openapi.paths['/posts']['post']['requestBody']['content']['application/json']
    >,
    res: Response<
      openapi.components['responses']['ResponsePost']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      checkParameterOrFail(req.body, 'post')
      let post = await postService.createPost(
        req.currentUser.id!,
        req.body.post
      )
      post = await postService.findOneOrFail(req.currentUser.id!, post.id!)
      res.json({ post: postSerializer.build(post) })
    } catch (e) {
      next(e)
    }
  }

  @Auth
  @Delete('/:id')
  async delete(
    req: Request<openapi.operations['deletePost']['parameters']['path']>,
    res: Response<
      openapi.components['responses']['ResponseSuccess']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const repo = getRepository(PostEntity)
      await postPolicy.deletableOrFail(req.params.id, req.currentUser.id!)
      await repo.delete(req.params.id)
      res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }

  @Patch('/:id/viewables')
  @Auth
  async updateViewables(
    req: Request<
      openapi.operations['updatePostViewables']['parameters']['path'],
      {},
      openapi.operations['updatePostViewables']['requestBody']['content']['application/json'],
      {}
    >,
    res: Response<
      openapi.components['responses']['ResponsePost']['content']['application/json']
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      await postPolicy.updatableOrFail(req.params.id, req.currentUser.id!)
      await postService.updateViewables(req.params.id, req.body.viewableUserIds)
      const post = await postService.findOneOrFail(
        req.currentUser.id!,
        req.params.id
      )
      res.json({ post: postSerializer.build(post) })
    } catch (e) {
      next(e)
    }
  }
}
