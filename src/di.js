import { ensureCurrentInstance, currentInstance } from './_internal'

export function provide(provide) {
  ensureCurrentInstance()
  const vm = currentInstance
  if (provide) {
    provide = typeof provide === 'function' ? provide.call(vm) : provide
    const p = vm._provide || Object.create(null)
    vm._provide = {
      ...p,
      ...provide
    }
  }
}

export function inject(injectKey) {
  ensureCurrentInstance()
  let vm = currentInstance

  if (inject) {
    while (vm) {
      const o = vm._provide
      if (o && o[injectKey]) {
        return o[injectKey]
      }
      vm = vm.$parent
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Injection "' + injectKey + '" not found')
    }
  }
}
