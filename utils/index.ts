import { isString, objectOf, optional } from 'ts-known'

export const hasMessage = objectOf({
  message: isString
})

export const isPATError = objectOf({
  response: optional(objectOf({
    data: optional(objectOf({
      message: optional(isString)
    }))
  }))
})
