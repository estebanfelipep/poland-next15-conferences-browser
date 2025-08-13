import { slow } from '@/utils/slow';
import type { Talk } from '@prisma/client';

// In-memory cache for search results to enable use() usage during demo
const cache = new Map<string, Promise<{ talks: Talk[]; totalPages: number }>>();

export function searchTalks(query: string): Promise<{ talks: Talk[]; totalPages: number }> {
  // eslint-disable-next-line no-console
  console.log('Client searchTalks called with query:', query);

  const cacheKey = `/search?q=${query}`;
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, getSearchResults(query));
  }
  return cache.get(cacheKey)!;
}

async function getSearchResults(searchTerm: string): Promise<{ talks: Talk[]; totalPages: number }> {
  await slow();

  const allTalks = FAKE_TALKS;
  const lowerQuery = searchTerm.trim().toLowerCase();
  const filteredTalks = allTalks.filter(talk => {
    return (
      talk.title.toLowerCase().includes(lowerQuery) ||
      talk.speaker.toLowerCase().includes(lowerQuery) ||
      talk.conference.toLowerCase().includes(lowerQuery) ||
      (talk.tag && talk.tag.toLowerCase().includes(lowerQuery))
    );
  });

  return {
    talks: filteredTalks,
    totalPages: 1,
  };
}

const FAKE_TALKS: Talk[] = [
  {
    conference: 'React Conf',
    createdAt: new Date('2024-01-01'),
    description: 'Learn how to build React applications that scale with your team and user base.',
    duration: 45,
    id: '1',
    slides: 'https://slides.com/sarah/react-scalable',
    speaker: 'Sarah Johnson',
    tag: 'React',
    title: 'Building Scalable React Applications',
    videoUrl: 'https://youtube.com/watch?v=example1',
    year: 2024,
  },
  {
    conference: 'JSConf',
    createdAt: new Date('2024-01-02'),
    description: 'Exploring upcoming JavaScript features and their impact on modern development.',
    duration: 60,
    id: '2',
    slides: null,
    speaker: 'Dan Abramov',
    tag: 'JavaScript',
    title: 'The Future of JavaScript',
    videoUrl: 'https://youtube.com/watch?v=example2',
    year: 2024,
  },
  {
    conference: 'TypeScript Summit',
    createdAt: new Date('2023-01-01'),
    description: 'Advanced TypeScript patterns for enterprise applications.',
    duration: 50,
    id: '3',
    slides: 'https://slides.com/emily/typescript-best',
    speaker: 'Emily Chen',
    tag: 'TypeScript',
    title: 'TypeScript Best Practices',
    videoUrl: null,
    year: 2023,
  },
  {
    conference: 'Next.js Conf',
    createdAt: new Date('2024-01-04'),
    description: 'Overview of new features and improvements in Next.js 15.',
    duration: 40,
    id: '4',
    slides: 'https://slides.com/vercel/nextjs15',
    speaker: 'Vercel Team',
    tag: 'Next.js',
    title: 'Next.js 15: Whats New',
    videoUrl: 'https://youtube.com/watch?v=example3',
    year: 2024,
  },
  {
    conference: 'React Universe Conf',
    createdAt: new Date('2025-01-01'),
    description:
      'Learn how modern React patterns, Actions, and View Transitions enable smooth, reliable async UI in Next.js App Router.',
    duration: 20,
    id: '5',
    slides: null,
    speaker: 'Aurora Scharff',
    tag: 'React',
    title: 'Modern React Patterns: Concurrent Rendering, Actions & Whats Next',
    videoUrl: null,
    year: 2025,
  },
  {
    conference: 'Web Perf Summit',
    createdAt: new Date('2023-01-02'),
    description: 'Techniques for optimizing web application performance.',
    duration: 55,
    id: '6',
    slides: null,
    speaker: 'Alex Rodriguez',
    tag: 'Performance',
    title: 'Web Performance Optimization',
    videoUrl: 'https://youtube.com/watch?v=example4',
    year: 2023,
  },
];
