export const SYMBOL_VALUE_WRAPPER = Symbol('SymbolValueWrapper')
export function isValueWrapper(source) {
  return source ? source[SYMBOL_VALUE_WRAPPER] === 1 : false
}

export let currentInstance = null

export function setCurrentInstance(instance) {
  currentInstance = instance
}

export function ensureCurrentInstance() {
  if (!currentInstance) {
    throw new Error(`invalid call.`)
  }
}
