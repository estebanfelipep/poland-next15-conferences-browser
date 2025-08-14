'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  hideSpinner?: boolean;
  options: SelectItem[];
  onSelect?: (item: SelectItem) => void;
} & SelectProps;

export default function AsyncSelect({ name, onSelect, ...otherProps }: Props) {
  const [selected, setSelected] = useState<SelectItem>({ label: 'All', value: '' });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Select
      {...otherProps}
      name={name}
      selected={selected}
      isPending={isLoading}
      onSelect={async item => {
        if (item.value === selected.value) return;
        onSelect?.(item);

        setIsLoading(true);
        setSelected(item);
        try {
          const result = await setAsyncFilter(item);
          setSelected(result);
        } catch (error) {
          setSelected({ label: 'All', value: '' });
          toast.error(`Failed to update filter ${name}: ${error}`);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}

function setAsyncFilter(item: SelectItem): Promise<SelectItem> {
  return new Promise(resolve => {
    setTimeout(() => {
      // reject(new Error('An error occurred'));
      resolve(item);
    }, 1000);
  });
}
