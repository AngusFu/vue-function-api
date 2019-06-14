import Vue, { observable } from './_vue'
import { isValueWrapper, currentInstance } from './_internal'

// 1. function that returns some value
// 2. a wrapper object
// 3. Array of [1] or [2]
export default function watch(source, callback, option) {
  if (!callback) return

  // TODO flush
  const { deep = false, lazy = false } = option || {}

  let cleanup = null
  let immediate = !lazy

  const isArray = Array.isArray(source)
  const setCleanUp = cb => (cleanup = cb)
  const runCleanUp = () => typeof cleanup === 'function' && cleanup()

  const onChange = (val, oldVal) => {
    if (immediate && isArray) {
      oldVal = oldVal || new Array(source.length)
      immediate = false
    }
    runCleanUp()
    // TODO call according to flush
    callback(val, oldVal, setCleanUp)
  }

  const isInSetup = !!currentInstance
  const vm = isInSetup ? currentInstance : new Vue()

  let watchFn = null
  if (Array.isArray(source)) {
    const sources = source.map(transform)
    const properties = sources.reduce((acc, getter, i) => {
      acc[`_${i}`] = { get: getter }
      return acc
    }, {})
    const obj = Object.defineProperties({}, properties)
    const state = observable(obj)
    watchFn = () => sources.map((_, i) => state['_' + i])
  } else {
    watchFn = transform(source)
  }

  let stopped = false
  const stop = vm.$watch(watchFn, onChange, { deep, immediate: !lazy })
  const unwatch = () => {
    if (!stopped) {
      runCleanUp()
      stop()
      stopped = true

      if (!isInSetup) {
        vm.$destroy()
      }
    }
  }

  vm.$on('hook:destroyed', unwatch)

  return unwatch
}

function transform(source) {
  if (source) {
    if (isValueWrapper(source)) {
      return () => source.value
    }

    if (typeof source === 'function') {
      return source
    }
  }

  /* istanbul ignore next */
  throw new Error('Invalid source.')
}
