let currentInstance = null
let isMounting = false
let callIndex = 0

export function hooks(Vue) {
  Vue.mixin({
    beforeCreate() {
      const { hooks, data } = this.$options
      if (hooks) {
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
      const { hooks, render } = this.$options
      if (hooks && render) {
        this.$options.render = function(h) {
          callIndex = 0
          currentInstance = this
          isMounting = !this._vnode
          const hookProps = hooks(this.$props)
          Object.assign(this._self, hookProps)
          const ret = render.call(this, h)
          currentInstance = null
          return ret
        }
      }
    }
  })
}
