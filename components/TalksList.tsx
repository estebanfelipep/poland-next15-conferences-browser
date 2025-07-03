import { Mail } from 'lucide-react';
import React, { startTransition, use, unstable_ViewTransition as ViewTransition } from 'react';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<Talk[]>;
  deferredSearch: string;
  selectedTalk: Talk | null;
  setSelectedTalk: (talk: Talk | null) => void;
};

export default function ContactList({ talksPromise, deferredSearch, setSelectedTalk }: Props) {
  const talks = use(talksPromise);
  const filteredTalks = talks.filter(talk => {
    return (
      talk.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      talk.speaker.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      talk.conference.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      (talk.tag && talk.tag.toLowerCase().includes(deferredSearch.toLowerCase()))
    );
  });

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTalks.map(talk => {
          return (
            <ViewTransition key={talk.id}>
              <Card>
                <TalkDetails
                  talk={talk}
                  onMessage={() => {
                    startTransition(() => {
                      setSelectedTalk(talk);
                    });
                  }}
                />
              </Card>
            </ViewTransition>
          );
        })}
      </div>
      {filteredTalks.length === 0 && (
        <div className="text-gray dark:text-gray py-8 text-center">
          No talks found matching &quot;{deferredSearch}&quot;
        </div>
      )}
    </>
  );
}

export function TalksListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}

function TalkDetails({ talk, onMessage }: { talk: Talk; onMessage: () => void }) {
  return (
    <div className="relative">
      <button
        onClick={onMessage}
        className="hover:bg-gray absolute top-0 right-0 cursor-pointer gap-2 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black"
      >
        <span className="sr-only">Send message</span>
        <Mail aria-hidden="true" width={16} height={16} />
      </button>
      <h3 className="mb-4 pr-12 text-lg font-semibold">{talk.title}</h3>
      <p className="mb-1 text-sm text-gray-500">
        <span className="font-medium">SPEAKER:</span> {talk.speaker}
      </p>
      <p className="mb-1 text-sm text-gray-500">
        <span className="font-medium">CONFERENCE:</span> {talk.conference}
      </p>
      <p className="mb-1 text-sm text-gray-500">
        <span className="font-medium">YEAR:</span> {talk.year}
      </p>
      {talk.tag && (
        <p className="mb-1 text-sm text-gray-500">
          <span className="font-medium">TAG:</span> {talk.tag}
        </p>
      )}
      {talk.duration && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">DURATION:</span> {talk.duration} minutes
        </p>
      )}
    </div>
  );
}
