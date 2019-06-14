import watch from './watch.js'
import value from './value'
import computed from './computed'
import Vue, { observable } from './_vue.js'
import { nextTick } from 'q'

var scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout

function flush() {
  return new Promise(function(resolve) {
    scheduler(resolve)
  })
}

it('should work with value wrappers', async () => {
  const arr = []
  const fn = jest.fn()

  const count = value(0)
  const double = computed(() => count.value * 2)

  const unwatch = watch(
    double,
    (val, oldVal, onCleanup) => {
      arr.push([val, oldVal])
      onCleanup(fn)
    },
    { lazy: false }
  )

  await flush()
  expect(arr[0]).toEqual([0, undefined])

  count.value++
  await flush()
  expect(arr[1]).toEqual([2, 0])

  count.value++
  count.value++
  await flush()
  expect(arr[2]).toEqual([6, 2])

  expect(fn).toHaveBeenCalledTimes(2)

  unwatch()
  expect(fn).toHaveBeenCalledTimes(3)
})

it('should work with functions', async () => {
  const arr = []
  const fn = jest.fn()

  const count = value(0)
  const double = computed(() => count.value * 2)

  const unwatch = watch(
    () => double.value + 1,
    (val, oldVal, onCleanup) => {
      arr.push([val, oldVal])
      onCleanup(fn)
    },
    { lazy: false }
  )

  await flush()
  expect(arr[0]).toEqual([1, undefined])

  count.value++
  await flush()
  expect(arr[1]).toEqual([3, 1])

  count.value++
  count.value++
  await flush()
  expect(arr[2]).toEqual([7, 3])

  expect(fn).toHaveBeenCalledTimes(2)

  unwatch()
  expect(fn).toHaveBeenCalledTimes(3)
})

it('should work with array', async () => {
  let arr = null
  const fn = jest.fn()

  const count = value(0)
  const count2 = value(20)

  const unwatch = watch(
    [count, () => count2.value + 1],
    (val, oldVal, onCleanup) => {
      arr = [val, oldVal]
      onCleanup(fn)
    },
    { lazy: false }
  )

  await flush()
  expect(arr).toEqual([[0, 21], [undefined, undefined]])

  count.value++
  await flush()
  expect(arr).toEqual([[1, 21], [0, 21]])

  count2.value++
  await flush()
  expect(arr).toEqual([[1, 22], [1, 21]])

  count.value++
  count2.value++
  await flush()
  expect(arr).toEqual([[2, 23], [1, 22]])

  expect(fn).toHaveBeenCalledTimes(3)

  unwatch()
  expect(fn).toHaveBeenCalledTimes(4)
})

test('lazy: true', async () => {
  let n = -1
  const fn = jest.fn()
  const state = observable({ x: 22 })
  watch(
    () => state.x,
    val => {
      n = val
      fn()
    },
    { lazy: true }
  )

  expect(n).toBe(-1)
  state.x = 33
  await flush()
  expect(n).toBe(33)
  expect(fn).toHaveBeenCalledTimes(1)
})

describe('Official demo testing', () => {
  test('demo 1', async () => {
    const count = value(0)
    let countPlusOne = undefined

    watch(
      () => count.value + 1,
      (value, oldValue) => {
        countPlusOne = value
      }
    )

    expect(countPlusOne).toBe(1)

    count.value++
    await flush()
    expect(countPlusOne).toBe(2)
  })

  test('demo 2', async () => {
    jest.useFakeTimers()

    const data = value(null)
    const props = observable({ id: 0 })
    const asyncAction = id =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ id })
        })
      })

    watch(
      () => props.id,
      async id => {
        data.value = await asyncAction(id)
      }
    )

    jest.runAllTimers()
    await flush()
    expect(data.value).toEqual({ id: 0 })

    props.id = 1
    await flush()

    jest.runAllTimers()
    await flush()
    expect(data.value).toEqual({ id: 1 })
  })

  test('demo2 in vue', done => {
    // test in vue
    const Comp = Vue.extend({
      props: ['id'],
      render() {
        return null
      },
      beforeMount() {
        const data = value(0)
        const props = this.$props

        const asyncAction = id =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve({ id })
            })
          })
        watch(
          () => props.id,
          async id => {
            data.value = await asyncAction(id)
          }
        )
        this._data = data
      },
      async mounted() {
        jest.runAllTimers()
        await flush()
        expect(this._data.value.id).toBe(22)
        done()
      }
    })
    new Comp({ propsData: { id: 22 } }).$mount()
  })
})
