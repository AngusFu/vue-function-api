export const ValueWrapperSymbol = Symbol('SymbolValueWrapper')
export function isValueWrapper(source) {
  return source ? source[ValueWrapperSymbol] === 1 : false
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
