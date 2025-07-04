'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import Select from './ui/select/Select';

type SelectItem = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  selected: SelectItem;
  label: string;
  options: SelectItem[];
  hideSpinner?: boolean;
  selectAction?: (item: SelectItem) => void | Promise<void>;
  onSelect?: (item: SelectItem) => void;
};

export default function RouterSelect({ name, options, label, selected, selectAction, onSelect }: Props) {
  const [optimisticItem, setOptimisticItem] = useOptimistic(selected);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      name={name}
      label={label}
      options={options}
      isPending={isPending}
      selected={optimisticItem}
      onSelect={item => {
        if (item.value === optimisticItem.value) return;
        onSelect?.(item);
        startTransition(async () => {
          setOptimisticItem(item);
          await selectAction?.(item);

          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.set(name, item.value);
          router.push('?' + newSearchParams.toString(), { scroll: false });
        });
      }}
    />
  );
}
