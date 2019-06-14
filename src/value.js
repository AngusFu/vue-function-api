import { observable } from './_vue'
import { ValueWrapperSymbol } from './_internal'

export default function value(initialVal) {
  return observable({ value: initialVal, [ValueWrapperSymbol]: 1 })
}
