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
        this.$options.render = result
      } else {
        Object.assign(this._self, result)
      }
    }
    setCurrentInstance(null)
  }
})
