'use client';

import React from 'react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import type { Talk } from '@prisma/client';

type Props = {
  talk: Talk;
  onSelect: () => void;
};

export function TalkCard({ talk, onSelect }: Props) {
  return (
    <Card className="hover:shadow-primary/25 h-full w-full transition-all hover:shadow-lg">
      <button onClick={onSelect} className="flex h-full w-full flex-col text-left">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-theme-text mb-2 text-lg leading-tight font-semibold">{talk.title}</h3>
            <p className="text-theme-text-secondary text-sm">
              by <span className="font-medium">{talk.speaker}</span>
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{talk.conference}</Badge>
          {talk.tag && <Badge variant="primary">{talk.tag}</Badge>}
          {talk.videoUrl && <Badge variant="accent">🎥 Video</Badge>}
          {talk.slides && <Badge variant="accent">📊 Slides</Badge>}
          {talk.duration && <Badge variant="secondary">{talk.duration}m</Badge>}
        </div>
        <p className="text-theme-text-secondary line-clamp-3 flex-1 text-sm">{talk.description}</p>
      </button>
    </Card>
  );
}
