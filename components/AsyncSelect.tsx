'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  hideSpinner?: boolean;
  options: SelectItem[];
  selected?: SelectItem[];
  onSelect?: (items: SelectItem[]) => void;
} & SelectProps;

export default function AsyncSelect({ name, selected: initialSelected = [], onSelect, ...otherProps }: Props) {
  const [selected, setSelected] = useState<SelectItem[]>(initialSelected);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Select
      {...otherProps}
      name={name}
      selected={selected}
      isPending={isLoading}
      onSelect={async items => {
        onSelect?.(items);

        setIsLoading(true);
        setSelected(items);
        try {
          const result = await executeAsyncWork(items);
          setSelected(result);
        } catch (error) {
          setSelected(initialSelected);
          toast.error(`Failed to update filter ${name}: ${error}`);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}

function executeAsyncWork(items: SelectItem[]): Promise<SelectItem[]> {
  return new Promise((resolve, reject) => {
    const delay = items.length === 0 ? 500 : items.length * 1500;
    setTimeout(() => {
      resolve(items);
      reject(new Error(`Failed to update filter with ${items.length} items`));
    }, delay);
  });
}
