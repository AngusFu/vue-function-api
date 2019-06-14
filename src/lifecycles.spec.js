import Vue, {
  value,
  nextTick,
  onCreated,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  onUpdated,
  onBeforeUpdate,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from './index'

Vue.config.productionTip = false

function render() {
  return null
}

it('should throw error if not called in setup()', () => {
  ;[
    onCreated,
    onBeforeMount,
    onMounted,
    onUnmounted,
    onBeforeUnmount,
    onUpdated,
    onBeforeUpdate,
    onActivated,
    onDeactivated,
    onErrorCaptured
  ].forEach(hook => {
    expect(hook).toThrow()
  })
})

it('should pass $props to setup function', done => {
  const App = Vue.extend({
    render,
    props: ['id'],
    setup(props) {
      expect(this.$props).toBe(props)
      expect(props.id).toBe(1)
      done()
    }
  })
  new App({ propsData: { id: 1 } })
})

it('should call onCreated hook immediately', done => {
  new Vue({
    render,
    setup(props) {
      const fn = jest.fn()
      onCreated(fn)
      expect(fn).toHaveBeenCalled()
      done()
    }
  })
})

test('onBeforeMount', done => {
  new Vue({
    render,
    setup(props) {
      onBeforeMount(() => {
        expect(this._isMounted).toBe(false)
        nextTick(() => {
          expect(this._isMounted).toBe(true)
          done()
        })
      })
    }
  }).$mount()
})

test('onMounted and onBeforeUnmount, onUnmounted', done => {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const vm = new Vue({
    el,
    render(h) {
      return h('div', { attrs: { id: 'test' } })
    },
    setup(props) {
      onMounted(() => {
        expect(this._isMounted).toBe(true)
        expect(this.$el).toBe(document.getElementById('test'))
        done()
      })

      onBeforeUnmount(() => {
        expect(this._isBeingDestroyed).toBe(false)
        nextTick(() => {
          expect(this._isBeingDestroyed).toBe(true)
        })
      })

      onUnmounted(() => {
        expect(this._isMounted).toBe(false)
        expect(this._isDestroyed).toBe(true)
        expect(this._isBeingDestroyed).toBe(true)
      })
    }
  })
})

test('onErrorCaptured', done => {
  const el = document.createElement('div')
  document.body.appendChild(el)

  // example from https://markeev.com/posts/vue-error-handling/
  const BadComp = {
    methods: {
      badOne: function() {
        throw new Error('from method')
      }
    },
    render(h) {
      return h('button', { on: { click: this.badOne } }, 'Click Me')
    }
  }

  const vm = new Vue({
    el,
    components: { BadComp },
    render(h) {
      return h('div', {}, [h('BadComp', {}, null)])
    },

    setup() {
      onMounted(() => {
        document.body.querySelector('button').click()
      })
      onErrorCaptured((err, component, details) => {
        expect(err.messsage === 'from method')
        done()
        return false
      })
    }
  }).$mount()
})

test('onBeforeUpdate and onUpdated', done => {
  new Vue({
    setup() {
      const msg = value('hello')
      onMounted(() => {
        expect(this.msg.value).toBe('hello')
        nextTick(() => {
          msg.value += ' world'
        })
      })

      onBeforeUpdate(() => {
        expect(this.$el.textContent).toBe('hello')
        expect(this.msg.value).toBe('hello world')
        expect(this._isMounted && !this._isDestroyed).toBe(true)
      })

      onUpdated(() => {
        expect(this.msg.value).toBe('hello world')
        done()
      })
      return { msg }
    },
    render(h) {
      return h('div', {}, this.msg.value)
    }
  }).$mount()
})

test('onActivated and onDeactivated', done => {
  const Comp = {
    props: ['msg'],
    render(h) {
      return h('div', {}, 'hello world')
    },
    setup() {
      onActivated(() => {
        expect(this.msg).toBe('hello')
        nextTick(() => {
          vm.change()
        })
      })
      onDeactivated(() => {
        expect(vm.data.value).toBe('Comp2')
        done()
      })
    }
  }
  const Comp2 = {
    render(h) {
      return h('div')
    }
  }
  const vm = new Vue({
    components: { Comp, Comp2 },
    setup() {
      const data = value('Comp')
      const change = () => (data.value = 'Comp2')
      return { data, change }
    },
    render(h) {
      return h('keep-alive', {}, [
        h('component', { is: this.data.value, props: { msg: 'hello' } })
      ])
    }
  }).$mount()
})
