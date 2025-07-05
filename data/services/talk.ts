import 'server-only';

import { prisma } from '@/db';
import type { FilterOptions, FilterType } from '@/types/filters';
import { slow } from '@/utils/slow';

export async function getTalks(filters: FilterType = {}) {
  await slow(1500);

  return prisma.talk.findMany({
    orderBy: { title: 'asc' },
    where: {
      ...(filters.speaker && { speaker: { contains: filters.speaker } }),
      ...(filters.year && { year: typeof filters.year === 'string' ? parseInt(filters.year) : filters.year }),
      ...(filters.tag && { tag: { contains: filters.tag } }),
      ...(filters.conference && { conference: { contains: filters.conference } }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search } },
          { speaker: { contains: filters.search } },
          { conference: { contains: filters.search } },
          { tag: { contains: filters.search } },
          { description: { contains: filters.search } },
        ],
      }),
    },
  });
}

export async function getTalkFilterOptions(): Promise<FilterOptions> {
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
      return { label: item.conference, value: item.conference };
    }),
    speakers: speakers.map(item => {
      return { label: item.speaker, value: item.speaker };
    }),
    tags: tags
      .map(item => {
        return { label: item.tag!, value: item.tag! };
      })
      .filter(Boolean),
    years: years.map(item => {
      return { label: item.year.toString(), value: item.year.toString() };
    }),
  };
}
