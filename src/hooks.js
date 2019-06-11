import Vue from 'vue'

let currentInstance = null
let isMounting = false
let callIndex = 0

function ensureCurrentInstance() {
  if (!currentInstance) {
    throw new Error(`invalid call.`)
  }
}

export const state = Vue.observable

export function value(initial) {
  const id = ++callIndex
  const state = currentInstance.$data._state
  if (isMounting) {
    currentInstance.$set(state, id, initial)
  }
  return state[id]
}

export function computed(getter) {
  ensureCurrentInstance()
  const id = ++callIndex
  const store = currentInstance._computedStore
  if (isMounting) {
    store[id] = getter()
    currentInstance.$watch(
      getter,
      val => {
        store[id] = val
      },
      { sync: true }
    )
  }
  return store[id]
}

export function watch(getter, cb, options) {
  ensureCurrentInstance()
  if (isMounting) {
    currentInstance.$watch(getter, cb, options)
  }
}

export function onMounted(fn) {
  useEffect(fn, [])
}

export function onDestroyed(fn) {
  useEffect(() => fn, [])
}

export function onUpdated(fn, deps) {
  const isMount = useRef(true)
  useEffect(() => {
    if (isMount.current) {
      isMount.current = false
    } else {
      return fn()
    }
  }, deps)
}

export function hooks(Vue) {
  Vue.mixin({
    beforeCreate() {
      const { setup, data } = this.$options
      if (setup) {
        this._effectStore = {}
        this._refsStore = {}
        this._computedStore = {}
        this.$options.data = function() {
          const ret = data ? data.call(this) : {}
          ret._state = {}
          return ret
        }
      }
    },
    beforeMount() {
      const { setup, render } = this.$options
      if (setup && render) {
        this.$options.render = function(h) {
          callIndex = 0
          currentInstance = this
          isMounting = !this._vnode
          const hookProps = setup(this.$props)
          Object.assign(this._self, hookProps)
          const ret = render.call(this, h)
          currentInstance = null
          return ret
        }
      }
    }
  })
}

function useRef(initial) {
  ensureCurrentInstance()
  const id = ++callIndex
  const { _refsStore: refs } = currentInstance
  return isMounting ? (refs[id] = { current: initial }) : refs[id]
}

function useEffect(rawEffect, deps) {
  ensureCurrentInstance()
  const id = ++callIndex
  if (isMounting) {
    const cleanup = () => {
      const { current } = cleanup
      if (current) {
        current()
        cleanup.current = null
      }
    }
    const effect = function() {
      const { current } = effect
      if (current) {
        cleanup.current = current.call(this)
        effect.current = null
      }
    }
    effect.current = rawEffect

    currentInstance._effectStore[id] = {
      effect,
      cleanup,
      deps
    }

    currentInstance.$on('hook:mounted', effect)
    currentInstance.$on('hook:destroyed', cleanup)
    if (!deps || deps.length > 0) {
      currentInstance.$on('hook:updated', effect)
    }
  } else {
    const record = currentInstance._effectStore[id]
    const { effect, cleanup, deps: prevDeps = [] } = record
    record.deps = deps
    if (!deps || deps.some((d, i) => d !== prevDeps[i])) {
      cleanup()
      effect.current = rawEffect
    }
  }
}
