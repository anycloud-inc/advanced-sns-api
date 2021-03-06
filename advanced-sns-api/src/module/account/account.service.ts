import { loadRelations } from 'src/lib/typeorm-helper'
import { validateOrFail } from 'src/lib/validate'
import { getRepository } from 'typeorm'
import { User } from '../user/user.entity'

export const accountService = {
  async saveAccount(
    user: User,
    props: { name?: string; email?: string; iconImageUrl?: string }
  ) {
    const repo = getRepository(User)
    let account = repo.create({
      ...user,
      ...props,
    })
    await validateOrFail(account)
    return await repo.save(account)
  },
  async loadRelations(user: User) {
    await loadRelations(
      [user],
      ['friendships', 'sendingFriendRequests', 'receivingFriendRequests']
    )
    return user
  },
}
