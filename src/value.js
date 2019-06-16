import { observable } from './_vue'
import { SYMBOL_VALUE_WRAPPER } from './_internal'

export default function value(initialVal) {
  return observable({ value: initialVal, [SYMBOL_VALUE_WRAPPER]: 1 })
}
