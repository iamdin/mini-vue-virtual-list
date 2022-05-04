import { describe, it, expect } from 'vitest'
import { binarySearchL, binarySearchR } from '../util'

describe('util', () => {
  it('binarySearchR', () => {
    const arr = [
      { height: 40, top: 0, bottom: 40 },
      { height: 20, top: 40, bottom: 60 },
      { height: 30, top: 60, bottom: 90 },
      { height: 10, top: 90, bottom: 100 },
    ]
    let scrollTop
    scrollTop = 0
    expect(binarySearchR(arr, (idx) => arr[idx].top <= scrollTop)).toBe(0)
    scrollTop = 40
    expect(binarySearchR(arr, (idx) => arr[idx].top <= scrollTop)).toBe(1)
    scrollTop = 50
    expect(binarySearchR(arr, (idx) => arr[idx].top <= scrollTop)).toBe(1)
    scrollTop = 60
    expect(binarySearchR(arr, (idx) => arr[idx].top <= scrollTop)).toBe(2)
    scrollTop = 95
    expect(binarySearchR(arr, (idx) => arr[idx].top <= scrollTop)).toBe(3)
  })
})
