export function makeSearchParams<TData extends Record<string, unknown>>(
  data: TData,
  keys?: (keyof TData)[]
) {
  const urlSearchParams = new URLSearchParams();

  if (!keys) {
    keys = Object.keys(data) as (keyof TData)[];
  }

  for (const key of keys) {
    if (data[key]) {
      urlSearchParams.set(key.toString(), data[key] as string);
    }
  }

  const searchParams = urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : '';
  return { searchParams };
}
