'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  selected: SelectItem;
  hideSpinner?: boolean;
  options: SelectItem[];
  onSelect?: (item: SelectItem) => void;
} & SelectProps;

export default function RouterSelect({ name, selected, onSelect, ...otherProps }: Props) {
  const router = useRouter();

  return (
    <Select
      {...otherProps}
      name={name}
      selected={selected}
      onSelect={async item => {
        if (item.value === selected.value) return;
        onSelect?.(item);

        router.push(`?${name}=${item.value}`);
      }}
    />
  );
}
