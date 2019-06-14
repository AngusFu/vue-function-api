const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout
export function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve)
  })
}

export function keys(obj) {
  if (typeof Reflect !== 'undefined') {
    return Reflect.ownKeys(obj)
  }
  return [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj)
  ]
}
