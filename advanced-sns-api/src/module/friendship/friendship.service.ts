import { EntityManager, getManager, getRepository } from 'typeorm'
import { validateOrFail } from 'src/lib/validate'
import { Friendship } from './friendship.entity'
import { postViewableService } from '../post-viewable/post-viewable.service'
import { Post } from '../post/post.entity'

interface CreateParams {
  userId: number
  friendId: number
}

interface CreateResponse {
  friendship: Friendship
  reverseFriendship: Friendship
}

export const friendshipService = {
  async createFriendship(
    params: CreateParams,
    em?: EntityManager
  ): Promise<CreateResponse> {
    if (em != null) {
      return this._createFriendshipInTransaction(em, params)
    } else {
      return await getManager().transaction(async entityManager => {
        return this._createFriendshipInTransaction(entityManager, params)
      })
    }
  },

  async _createFriendshipInTransaction(
    em: EntityManager,
    params: CreateParams
  ): Promise<CreateResponse> {
    const repo = getRepository(Friendship)
    let friendship = repo.create({ ...params })
    await this.validate(friendship)
    let reverseFriendship = repo.create({
      userId: params.friendId,
      friendId: params.userId,
    })
    await this.validate(reverseFriendship)
    friendship = await em.save(friendship)
    reverseFriendship = await em.save(reverseFriendship)
    await this._createPostViewableEachOther(params.userId, params.friendId, em)

    return { friendship, reverseFriendship }
  },

  async _createPostViewableEachOther(
    userIdA: number,
    userIdB: number,
    em?: EntityManager
  ) {
    if (!em) {
      em = getManager()
    }
    await this._createPostViewable(em, userIdA, userIdB)
    await this._createPostViewable(em, userIdB, userIdA)
  },

  async _createPostViewable(
    em: EntityManager,
    userId: number,
    targetUserId: number
  ) {
    const posts = await getRepository(Post).find({
      where: { userId },
      take: 10,
      order: { createdAt: 'DESC' },
    })
    const postIds = posts.map(p => p.id!)
    await postViewableService.createForUser(em, targetUserId, postIds)
  },

  async validate(friendship: Friendship) {
    await validateOrFail(friendship)
  },
}
