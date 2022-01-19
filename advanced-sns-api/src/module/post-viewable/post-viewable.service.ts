import { EntityManager, getRepository } from 'typeorm'
import { PostViewable } from './post-viewable.entity'

export const postViewableService = {
  async createForPost(em: EntityManager, postId: number, userIds: number[]) {
    if (userIds.length === 0) return
    const viewables = userIds.map(userId => ({
      userId,
      postId,
    }))
    const [sql, parameters] = em
      .createQueryBuilder(em.queryRunner)
      .insert()
      .into(PostViewable)
      .values(viewables)
      .orIgnore(true)
      .getQueryAndParameters()
    await em.query(sql, parameters)
  },

  async createForUser(em: EntityManager, userId: number, postIds: number[]) {
    if (postIds.length === 0) return
    const viewables = postIds.map(postId => ({
      userId,
      postId,
    }))
    const [sql, parameters] = em
      .createQueryBuilder(em.queryRunner)
      .insert()
      .into(PostViewable)
      .values(viewables)
      .orIgnore(true)
      .getQueryAndParameters()
    await em.query(sql, parameters)
  },
  async delete(postViewables: PostViewable[]) {
    await getRepository(PostViewable).remove(postViewables)
  },
}
