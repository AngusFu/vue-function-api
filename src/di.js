import { ensureCurrentInstance, currentInstance } from './_internal'

export function provide(provide) {
  ensureCurrentInstance()
  const vm = currentInstance
  if (provide) {
    provide = typeof provide === 'function' ? provide.call(vm) : provide
    const p = vm._provided_fn_api || Object.create(null)
    vm._provided_fn_api = {
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
      const o = vm._provided_fn_api
      // TODO
      // implement auto unwrapping
      // through watch....
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
