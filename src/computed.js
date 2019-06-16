import { observable } from './_vue'
import { SYMBOL_VALUE_WRAPPER } from './_internal'

export default function computed(getter, setter) {
  const obj = Object.defineProperty({ [SYMBOL_VALUE_WRAPPER]: 1 }, 'value', {
    get: getter,
    set: setter
  })
  return observable(obj)
}
