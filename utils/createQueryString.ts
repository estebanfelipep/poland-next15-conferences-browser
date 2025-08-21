import type { ReadonlyURLSearchParams } from 'next/navigation';

export function createQueryString(
  searchParams: ReadonlyURLSearchParams,
  { name, value }: { name: string; value: string | string[] | { value: string }[] },
) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(name);

  let values: string[];
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && 'value' in value[0]) {
      values = (value as { value: string }[]).map(item => {
        return item.value;
      });
    } else {
      values = value as string[];
    }
  } else {
    values = [value];
  }

  values.forEach(v => {
    if (v && v.trim()) {
      params.append(name, v);
    }
  });

  return '?' + params.toString();
}
