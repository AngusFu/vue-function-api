import Vue from 'vue'
import { hooks, value, computed } from './hooks'

Vue.use(hooks)

new Vue({
  el: '#app',
  render(h) {
    return h('div', null, [
      h(
        'button',
        {
          on: {
            click: () => {
              this.data.count++
            }
          }
        },
        'next'
      ),
      h('br'),
      this.data.count,
      ' * 2 = ',
      this.double
    ])
  },
  setup() {
    const data = value({ count: 2 })
    const double = computed(() => data.count * 2)

    return {
      data,
      double
    }
  }
})
