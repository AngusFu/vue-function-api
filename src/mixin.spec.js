import Vue, { onCreated, onMounted, nextTick } from './index'

test('1. render function in setup', done => {
  const fn = jest.fn()
  new Vue({
    setup() {
      onCreated(() => {
        nextTick(() => {
          expect(this.$options.render).toBe(fn)
          done()
        })
      })
      return fn
    },
    render() {}
  })
})

test('2. render function in setup', done => {
  new Vue({
    setup() {
      onMounted(() => {
        expect(this.$el.textContent).toBe('1234')
        done()
      })
      return h => h('div', {}, '1234')
    },
    render() {
      return h('div')
    }
  }).$mount()
})
