import Vue from './index'
import { inject, provide } from './di'

it('works as MVP', done => {
  const s = Symbol()

  const Provider = {
    setup() {
      provide({ [s]: 'foo' })
    },
    render(h) {
      return h('div', {}, this.$slots.default)
    }
  }

  const Child = {
    setup() {
      const msg = inject(s)

      expect(msg).toBe('foo')
      done()

      return { msg }
    },
    render(h) {
      return h('span', {}, this.msg)
    }
  }

  new Vue({
    render(h) {
      return h(Provider, {}, [h(Child)])
    }
  }).$mount()
})
