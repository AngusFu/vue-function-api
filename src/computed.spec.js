import value from './value'
import computed from './computed'

it('should work as expected', () => {
  const count = value(0)
  const plusOne = computed(() => count.value + 1)

  expect(plusOne.value).toBe(1)

  count.value++
  expect(plusOne.value).toBe(2)
})

it('should work as writable computed', () => {
  let mockFn = jest.fn()
  const count = value(0)
  const writableComputed = computed(
    // read
    () => count.value + 1,
    // write
    val => {
      mockFn()
      count.value = val - 1
    }
  )

  expect(writableComputed.value).toBe(1)

  writableComputed.value++
  expect(writableComputed.value).toBe(2)

  count.value++
  expect(writableComputed.value).toBe(3)

  expect(mockFn).toHaveBeenCalled()
})
