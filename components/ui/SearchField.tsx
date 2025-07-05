'use client';

import { Search } from 'lucide-react';
import React from 'react';
import Spinner from './Spinner';

type Props = {
  isSearching?: boolean;
};

export default function SearchField({
  isSearching,
  placeholder,
  ...otherProps
}: Props & React.HTMLProps<HTMLInputElement>) {
  return (
    <div className="relative">
      <input className="pl-9" {...otherProps} placeholder={placeholder || 'Search...'} type="search" />
      <div className="text-gray absolute top-1/2 left-3 -translate-y-1/2">
        {isSearching ? (
          <div aria-label="searching..." className="h-fit w-fit animate-spin">
            <Spinner width={16} height={16} className="text-gray" />
          </div>
        ) : (
          <Search aria-hidden="true" width={16} height={16} className="text-gray" />
        )}
      </div>
    </div>
  );
}
