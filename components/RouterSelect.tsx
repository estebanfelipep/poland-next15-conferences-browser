'use client';

import { useQueryState } from 'nuqs';
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
  const [, setQueryParam] = useQueryState(name);

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
          setQueryParam(item.value, {
            shallow: false,
          });
        });
      }}
    />
  );
}
