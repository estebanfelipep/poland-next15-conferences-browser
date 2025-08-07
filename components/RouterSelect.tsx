'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  selected: SelectItem;
  hideSpinner?: boolean;
  options: SelectItem[];
  selectAction?: (item: SelectItem) => void | Promise<void>;
  onSelect?: (item: SelectItem) => void;
} & SelectProps;

export default function RouterSelect({ name, selected, selectAction, onSelect, ...otherProps }: Props) {
  const [optimisticItem, setOptimisticItem] = useOptimistic(selected);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <Select
      {...otherProps}
      name={name}
      isPending={isPending}
      selected={optimisticItem}
      onSelect={item => {
        if (item.value === optimisticItem.value) return;
        onSelect?.(item);

        startTransition(async () => {
          setOptimisticItem(item);
          await selectAction?.(item);
          router.push(`?${createQueryString(name, item.value)}`);
        });
      }}
    />
  );
}
