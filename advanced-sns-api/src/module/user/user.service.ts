import { addPagination, PaginationParams } from 'src/lib/typeorm-helper'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { User } from '../user/user.entity'

export interface FindParams {
  name?: string
}

export const userService = {
  async find(params: FindParams, pagination: PaginationParams) {
    const repo = getRepository(User)
    let qb = repo.createQueryBuilder('user')
    qb = this.addSearchFilter(qb, params)
    qb = addPagination(qb, pagination)
    return await qb.getMany()
  },

  async findOneWithMetadata(userId: number): Promise<User> {
    const repo = getRepository(User)
    return await repo.findOneOrFail({
      where: { id: userId },
    })
  },

  addSearchFilter<T>(
    qb: SelectQueryBuilder<T>,
    filter: FindParams
  ): SelectQueryBuilder<T> {
    if (filter?.name) {
      qb = qb.andWhere(`${qb.alias}.name LIKE :name`, {
        name: `%${filter.name}%`,
      })
    }
    return qb
  },
}
