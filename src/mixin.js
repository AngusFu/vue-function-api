import Vue from './_vue'
import { setCurrentInstance } from './_internal'

Vue.mixin({
  beforeCreate() {
    const { setup } = this.$options
    if (setup) {
      this.$options.setup = setup.bind(this)
    }
  },
  created() {
    setCurrentInstance(this)
    const { setup } = this.$options
    if (setup) {
      const result = setup(this.$props)
      if (typeof result === 'function') {
        // TODO implementation: new render function
        // SEE https://github.com/vuejs/rfcs/blob/render-fn-api-change/active-rfcs/0000-render-function-api-change.md
        this.$options.render = result
      } else {
        Object.assign(this._self, result)
      }
    }
    setCurrentInstance(null)
  }
})
