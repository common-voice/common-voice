export function pick<T, K extends keyof T>(obj: T, keys: K[]) {
  return keys.reduce((acc, val) => {
    return (acc[val] = obj[val]), acc
  }, {} as Pick<T, K>)
}
