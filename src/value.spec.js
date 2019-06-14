import value from './value'

it('should work with primitives', () => {
  const count = value(0)
  expect(count.value).toBe(0)
  count.value++
  expect(count.value).toBe(1)
})

it('should work with object values', () => {
  const store = value({ count: 0 })
  expect(store.value).toEqual({ count: 0 })

  store.value.count += 2
  expect(store.value).toEqual({ count: 2 })

  store.value.attr2 = 1
  expect(store.value).toEqual({ count: 2, attr2: 1 })
})

it('should throw errors with nil values', () => {
  const store = value()
  expect(() => store.value.name).toThrow()

  const store2 = value(null)
  expect(() => store2.value.name).toThrow()
})
