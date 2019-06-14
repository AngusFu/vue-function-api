import { currentInstance, ensureCurrentInstance } from './_internal'

const setHook = (lifecycle, fn) => {
  ensureCurrentInstance()
  currentInstance.$on('hook:' + lifecycle, fn)
}

// We cannot access props until created...
// export function onBeforeCreate(fn) {
//   setHook('beforeCreate', fn)
// }

export function onCreated(fn) {
  // Since we inject `$options.setup` in `created` hook
  fn()
  // setHook('created', fn)
}

export function onBeforeMount(fn) {
  setHook('beforeMount', fn)
}

export function onMounted(fn) {
  setHook('mounted', fn)
}

export function onBeforeUpdate(fn) {
  setHook('beforeUpdate', fn)
}

export function onUpdated(fn) {
  setHook('updated', fn)
}

export function onBeforeUnmount(fn) {
  setHook('beforeDestroy', fn)
}

export function onUnmounted(fn) {
  setHook('destroyed', fn)
}

export function onActivated(fn) {
  setHook('activated', fn)
}

export function onDeactivated(fn) {
  setHook('deactivated', fn)
}

export function onErrorCaptured(fn) {
  ensureCurrentInstance()
  const { errorCaptured } = currentInstance.$options

  /* istanbul ignore next */
  currentInstance.$options.errorCaptured = errorCaptured
    ? [fn].concat(errorCaptured)
    : [fn]
}
