export function binarySearchR(arr, check?: (idx: number) => boolean) {
  let l = 0,
    r = arr.length - 1
  while (l < r) {
    const mid = (l + r + 1) >> 1
    if (check(mid)) {
      l = mid
    } else {
      r = mid - 1
    }
  }
  return l
}

export function binarySearchL(arr, check?: (idx: number) => boolean) {
  let l = 0,
    r = arr.length - 1
  while (l < r) {
    const mid = (l + r) >> 1
    if (check(mid)) {
      r = mid
    } else {
      l = mid + 1
    }
  }
  return l
}
