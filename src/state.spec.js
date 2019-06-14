import state from './state'
import value from './value'

test('automatically unwrapped when accessed as a nested property inside a reactive object', () => {
  const count = value(0)
  const obj = state({
    count
  })

  expect(obj.count).toBe(0)

  obj.count++
  expect(obj.count).toBe(1)
  expect(count.value).toBe(1)

  count.value++
  expect(obj.count).toBe(2)
  expect(count.value).toBe(2)
})
