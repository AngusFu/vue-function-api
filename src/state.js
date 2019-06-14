import { observable } from './_vue'
import { keys } from './_utils'
import { isValueWrapper } from './_internal'

export default function state(obj) {
  obj = obj && typeof obj === 'object' ? { ...obj } : Object.create(null)

  // According to the RFC ——
  // ```
  // Value wrappers are also automatically unwrapped when accessed as a nested
  // property inside a reactive object
  // ```
  keys(obj).forEach(key => {
    const val = obj[key]
    if (isValueWrapper(val)) {
      Object.defineProperty(obj, key, {
        get() {
          return val.value
        },
        set(v) {
          val.value = v
        }
      })
    }
  })
  return observable(obj)
}
