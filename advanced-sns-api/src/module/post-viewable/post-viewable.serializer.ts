import { PostViewable } from './post-viewable.entity'
import dayjs = require('dayjs')
import * as openapi from 'advanced-sns-openapi-server-interface/outputs/openapi_server_interface/ts/types'

export const postViewableSerializer = {
  build: (
    item: PostViewable
  ): openapi.components['schemas']['EntityPostViewable'] => {
    return {
      ...item,
      id: item.id!,
      createdAt: dayjs(item.createdAt!).format(),
    }
  },
}
