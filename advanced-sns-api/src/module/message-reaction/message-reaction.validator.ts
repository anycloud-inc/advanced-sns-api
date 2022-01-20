import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { Room } from '../room/room.entity'
import { getRepository } from 'typeorm'
import { MessageReaction } from './message-reaction.entity'
import { Message } from '../message/message.entity'

export function IsValidMessage(options?: ValidationOptions) {
  return function (object: MessageReaction, propertyName: string) {
    registerDecorator({
      name: 'isValidUser',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        async validate(messageId: any, args: ValidationArguments) {
          const message = await getRepository(Message).findOneOrFail(messageId)
          const room = await getRepository(Room).findOneOrFail(message.roomId, {
            relations: ['roomUsers'],
          })
          if (!room.roomUsers) return false
          const messageReaction = args.object as MessageReaction
          const user = room.roomUsers.find(
            roomUser => roomUser.userId === messageReaction.userId
          )
          return !!user
        },
      },
    })
  }
}
