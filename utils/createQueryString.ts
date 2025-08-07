import type { ReadonlyURLSearchParams } from 'next/navigation';

export function createQueryString(
  searchParams: ReadonlyURLSearchParams,
  { name, value }: { name: string; value: string },
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);
  return params.toString();
}
