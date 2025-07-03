import 'server-only';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export type TalkFilters = {
  title?: string;
  speaker?: string;
  year?: string | number;
  tag?: string;
  conference?: string;
};

export async function getTalks(filters: TalkFilters = {}) {
  await slow(1500);

  return prisma.talk.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      ...(filters.title && { title: { contains: filters.title } }),
      ...(filters.speaker && { speaker: { contains: filters.speaker } }),
      ...(filters.year && { year: typeof filters.year === 'string' ? parseInt(filters.year) : filters.year }),
      ...(filters.tag && { tag: { contains: filters.tag } }),
      ...(filters.conference && { conference: { contains: filters.conference } }),
    },
  });
}

export async function getTalkFilterOptions() {
  await slow(300);

  const [years, tags, conferences, speakers] = await Promise.all([
    prisma.talk.findMany({
      distinct: ['year'],
      orderBy: { year: 'desc' },
      select: { year: true },
    }),
    prisma.talk.findMany({
      distinct: ['tag'],
      orderBy: { tag: 'asc' },
      select: { tag: true },
      where: { tag: { not: null } },
    }),
    prisma.talk.findMany({
      distinct: ['conference'],
      orderBy: { conference: 'asc' },
      select: { conference: true },
    }),
    prisma.talk.findMany({
      distinct: ['speaker'],
      orderBy: { speaker: 'asc' },
      select: { speaker: true },
    }),
  ]);

  return {
    conferences: conferences.map(item => {
      return { id: item.conference, text: item.conference };
    }),
    speakers: speakers.map(item => {
      return { id: item.speaker, text: item.speaker };
    }),
    tags: tags
      .map(item => {
        return { id: item.tag!, text: item.tag! };
      })
      .filter(Boolean),
    years: years.map(item => {
      return { id: item.year.toString(), text: item.year.toString() };
    }),
  };
}
