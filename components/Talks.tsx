'use client';

import React, { useState } from 'react';
import type { TalksResult } from '@/types/talk';
import TalksList from './TalksList';
import SearchField from './ui/SearchField';

type Props = {
  talksPromise: Promise<TalksResult>;
  children?: React.ReactNode;
};

export default function Talks({ talksPromise, children }: Props) {
  const [search, setSearch] = useState('');

  return (
    <>
      <SearchField
        value={search}
        name="search"
        placeholder="Search by title, description, speaker, conference, or tag..."
        onChange={e => {
          setSearch(e.currentTarget.value);
        }}
      />
      {children}
      <TalksList talksPromise={talksPromise} search={search} />
    </>
  );
}
