import { observable } from './_vue'
import { ValueWrapperSymbol } from './_internal'

export default function computed(getter, setter) {
  const obj = Object.defineProperty({ [ValueWrapperSymbol]: 1 }, 'value', {
    get: getter,
    set: setter
  })
  return observable(obj)
}
