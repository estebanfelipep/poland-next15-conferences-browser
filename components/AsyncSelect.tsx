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

        setSelected(item);
        setIsLoading(true);
        const result = await sendAsyncSelectChange(name, item.value);
        if (result?.error) {
          toast.error(`Failed to update filter ${name}: ${result.error}`);
          setSelected({ label: 'All', value: '' });
        } else {
          toast.success(`Filter ${name} updated to ${item.label}`);
        }
        setIsLoading(false);
      }}
    />
  );
}

function sendAsyncSelectChange(name: string, value: string): Promise<{ error: string | null }> {
  console.log(`Sending async select change for ${name} with value: ${value}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ error: null });
      // resolve({ error: 'An error occurred' });
    }, 1000);
  });
}
