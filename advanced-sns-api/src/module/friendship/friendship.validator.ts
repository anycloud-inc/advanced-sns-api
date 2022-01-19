import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { Friendship } from './friendship.entity'

export function IsValidFriend(options?: ValidationOptions) {
  return function (object: Friendship, propertyName: string) {
    registerDecorator({
      name: 'IsValidFriend',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const friendship = args.object as Friendship
          if (value === friendship.userId) {
            return false
          }
          return true
        },
      },
    })
  }
}
