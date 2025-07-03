import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TALKS = [
  {
    conference: 'React Conf',
    description: 'Learn how to build React applications that scale with your team and user base.',
    duration: 45,
    slides: 'https://slides.com/sarah/react-scalable',
    speaker: 'Sarah Johnson',
    tag: 'React',
    title: 'Building Scalable React Applications',
    videoUrl: 'https://youtube.com/watch?v=example1',
    year: 2024,
  },
  {
    conference: 'JSConf',
    description: 'Exploring upcoming JavaScript features and their impact on modern development.',
    duration: 60,
    speaker: 'Dan Abramov',
    tag: 'JavaScript',
    title: 'The Future of JavaScript',
    videoUrl: 'https://youtube.com/watch?v=example2',
    year: 2024,
  },
  {
    conference: 'TypeScript Summit',
    description: 'Advanced TypeScript patterns for enterprise applications.',
    duration: 50,
    slides: 'https://slides.com/emily/typescript-best',
    speaker: 'Emily Chen',
    tag: 'TypeScript',
    title: 'TypeScript Best Practices',
    year: 2023,
  },
  {
    conference: 'Next.js Conf',
    description: 'Overview of new features and improvements in Next.js 15.',
    duration: 40,
    slides: 'https://slides.com/vercel/nextjs15',
    speaker: 'Vercel Team',
    tag: 'Next.js',
    title: "Next.js 15: What's New",
    videoUrl: 'https://youtube.com/watch?v=example3',
    year: 2024,
  },
  {
    conference: 'Web Perf Summit',
    description: 'Techniques for optimizing web application performance.',
    duration: 55,
    speaker: 'Alex Rodriguez',
    tag: 'Performance',
    title: 'Web Performance Optimization',
    videoUrl: 'https://youtube.com/watch?v=example4',
    year: 2023,
  },
  {
    conference: 'GraphQL Summit',
    description: 'Real-world experiences implementing GraphQL at scale.',
    duration: 45,
    slides: 'https://slides.com/maria/graphql-production',
    speaker: 'Maria Santos',
    tag: 'GraphQL',
    title: 'GraphQL in Production',
    year: 2024,
  },
  {
    conference: 'CSS Day',
    description: 'Master modern CSS layout techniques.',
    duration: 35,
    slides: 'https://slides.com/david/css-mastery',
    speaker: 'David Kim',
    tag: 'CSS',
    title: 'CSS Grid and Flexbox Mastery',
    videoUrl: 'https://youtube.com/watch?v=example5',
    year: 2023,
  },
  {
    conference: 'DevX Conf',
    description: 'How to create effective developer tools and experiences.',
    duration: 50,
    speaker: 'Jennifer Liu',
    tag: 'DevTools',
    title: 'Building Developer Tools',
    year: 2024,
  },
  {
    conference: 'Frontend Arch Summit',
    description: 'Implementing micro-frontends in large-scale applications.',
    duration: 60,
    speaker: 'Robert Brown',
    tag: 'Architecture',
    title: 'Micro-frontends Architecture',
    videoUrl: 'https://youtube.com/watch?v=example6',
    year: 2023,
  },
  {
    conference: 'AI Dev Conference',
    description: 'Leveraging AI tools to enhance developer productivity.',
    duration: 45,
    slides: 'https://slides.com/lisa/ai-development',
    speaker: 'Lisa Wang',
    tag: 'AI',
    title: 'AI-Powered Development',
    year: 2024,
  },
  {
    conference: 'A11y Summit',
    description: 'Building inclusive web applications for all users.',
    duration: 40,
    speaker: 'Michael Thompson',
    tag: 'Accessibility',
    title: 'Accessibility in Modern Web Apps',
    videoUrl: 'https://youtube.com/watch?v=example7',
    year: 2023,
  },
  {
    conference: 'React Conf',
    description: 'From Redux to Zustand: choosing the right state management.',
    duration: 35,
    slides: 'https://slides.com/anna/state-management',
    speaker: 'Anna Petrov',
    tag: 'State Management',
    title: 'State Management Evolution',
    year: 2024,
  },
];

async function seed() {
  await Promise.all(
    TALKS.map(talk => {
      return prisma.talk.create({
        data: {
          conference: talk.conference,
          description: talk.description,
          duration: talk.duration,
          slides: talk.slides,
          speaker: talk.speaker,
          tag: talk.tag,
          title: talk.title,
          videoUrl: talk.videoUrl,
          year: talk.year,
        },
      });
    }),
  )
    .then(() => {
      return console.info('[SEED] Successfully created talk records');
    })
    .catch(e => {
      return console.error('[SEED] Failed to create talk records', e);
    });
}

seed();
