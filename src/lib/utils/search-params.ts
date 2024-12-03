export function makeSearchParams<TData extends Record<string, unknown>>(
  data: TData,
  keys: (keyof TData)[]
) {
  const urlSearchParams = new URLSearchParams();

  for (const key of keys) {
    if (data[key]) {
      urlSearchParams.set(key.toString(), data[key] as string);
    }
  }

  const searchParams = urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : '';
  return { searchParams };
}
