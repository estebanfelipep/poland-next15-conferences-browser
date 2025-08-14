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
          await setAsyncFilter(name, item.value);
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

function setAsyncFilter(name: string, value: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('An error occurred'));
      resolve({ name, value });
    }, 1000);
  });
}
