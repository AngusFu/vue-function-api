import Vue, { observable, nextTick } from './_vue'
import './mixin'

export default Vue
export { observable as state, nextTick }

export { default as value } from './value'
export { default as computed } from './computed'
export { default as watch } from './watch'

export * from './lifecycles'

export function createComponent(vue) {
  return vue
}
