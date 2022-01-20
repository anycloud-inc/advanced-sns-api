import {
  addPagination,
  loadRelations,
  PaginationParams,
} from 'src/lib/typeorm-helper'
import { validateOrFail } from 'src/lib/validate'
import { getManager, getRepository, SelectQueryBuilder } from 'typeorm'
import { Message } from '../message/message.entity'
import { postViewableService } from '../post-viewable/post-viewable.service'
import { Post } from './post.entity'

interface CreateParams {
  body: string
  viewableUserIds?: number[]
}

interface FindParams {
  pagination: PaginationParams
  filter: FilterParams
}

export interface FilterParams {
  userId?: number
}

export const postService = {
  async find(params: FindParams) {
    const repo = getRepository(Post)
    let qb = repo.createQueryBuilder('post')
    if (params.filter) qb = this._addSearchFilter(qb, params.filter)
    qb = addPagination(qb, params.pagination)
    let posts = await qb.getMany()
    await loadRelations(posts, ['messages', 'seenLogs', 'viewables'])
    return posts
  },

  async findOneOrFail(id: number): Promise<Post> {
    const post = await getRepository(Post).findOneOrFail(id, {})
    return post
  },

  async getCreatorId(postId: number): Promise<number> {
    const post = await this.findOneOrFail(postId)
    return post.userId
  },

  async createPost(userId: number, params: CreateParams) {
    const repo = getRepository(Post)
    let post = repo.create({
      userId,
      body: params.body,
    })

    await this._validatePost(post)

    post = await getManager().transaction(async em => {
      post = await em.save(post)
      if (params.viewableUserIds) {
        await postViewableService.createForPost(
          em,
          post.id!,
          params.viewableUserIds
        )
      }
      return post
    })

    return post
  },

  async loadOwnMessages(userId: number, posts: Post[]) {
    const qb = getRepository(Message)
      .createQueryBuilder('message')
      .where('message.userId = :userId', { userId })
    await loadRelations(posts, [{ name: 'messages', qb }])
    return await qb.getMany()
  },

  async _validatePost(post: Post) {
    await validateOrFail(post)
  },

  _addSearchFilter<T>(
    qb: SelectQueryBuilder<T>,
    filter: FilterParams
  ): SelectQueryBuilder<T> {
    if (filter.userId != null) {
      qb = qb.andWhere(`${qb.alias}.userId = :userId`, {
        userId: filter.userId,
      })
    }
    return qb
  },
}
