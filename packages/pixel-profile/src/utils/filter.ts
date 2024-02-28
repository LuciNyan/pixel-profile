export function filterNotEmpty<T extends Record<string, unknown>>(obj: T): FilteredObj<T> {
  const result = {} as T

  for (const key in obj) {
    const value = obj[key]
    if (value !== null && value !== undefined) {
      result[key] = value
    }
  }

  // TODO: type
  return result as FilteredObj<T>
}

export type FilteredObj<T> = {
  [K in keyof T as Exclude<T[K], undefined | null> extends never ? never : K]: Exclude<T[K], undefined | null>
}
