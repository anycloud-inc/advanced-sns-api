import { notFound } from 'boom'
import * as express from 'express'
import { useController } from './lib/controller'
import { AccountController } from './module/account/account.controller'
import { AuthController } from './module/auth/auth.controller'
import { FriendRequestController } from './module/friend-request/friend-request.controller'
import { FriendController } from './module/friend/friend.controller'
import { FriendshipController } from './module/friendship/friendship.controller'
import { MessageController } from './module/message/message.controller'
import { PostSeenLogController } from './module/post-seen-log/post-seen-log.controller'
import { PostController } from './module/post/post.controller'
import { RoomController } from './module/room/room.controller'
import { TimelineController } from './module/timeline/timeline.controller'

const router = express.Router()

router.get('/', (req, res) => res.send('OK!!!!!!'))
router.get('/routes', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return next(notFound())
  res.send(
    router.stack
      .map(x => `${x.route.stack[0]?.method} ${x.route.path}`)
      .join('</br>')
  )
})

useController(router, AccountController)
useController(router, AuthController)
useController(router, PostController)
useController(router, RoomController)
useController(router, MessageController)
useController(router, FriendRequestController)
useController(router, PostSeenLogController)
useController(router, FriendController)
useController(router, TimelineController)
useController(router, FriendshipController)

export default router
