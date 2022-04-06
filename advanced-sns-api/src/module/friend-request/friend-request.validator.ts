import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { getRepository } from 'typeorm'
import { Friendship } from '../friendship/friendship.entity'
import { FriendRequest, Status } from './friend-request.entity'

export function IsValidReceiver(options?: ValidationOptions) {
  return function (object: FriendRequest, propertyName: string) {
    registerDecorator({
      name: 'IsValidReceiver',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const request = args.object as FriendRequest

          // 自分には友達申請送れない
          if (value === request.senderId) return false

          // 友達には送れない
          const friendship = await getRepository(Friendship).findOne({
            userId: request.senderId,
            friendId: request.receiverId,
          })
          if (friendship != null) return false

          // insert時にすでに送ってるリクエストがある場合は送れない
          if (!request.id) {
            const friendRequest = await getRepository(FriendRequest).findOne({
              senderId: request.senderId,
              receiverId: request.receiverId,
              status: Status.Requesting,
            })
            if (friendRequest) return false
          }

          return true
        },
      },
    })
  }
}
