import 'server-only';

import { prisma } from '@/db';
import type { FilterOptions, FilterType } from '@/types/filters';
import { slow } from '@/utils/slow';
import type { Prisma } from '@prisma/client';

export async function getTalks(filters: FilterType = {}) {
  'use cache';

  await slow(1500);

  const where: Prisma.TalkWhereInput = {};
  if (filters.speaker?.trim()) {
    where.speaker = { contains: filters.speaker.trim(), mode: 'insensitive' };
  }
  if (filters.year?.toString().trim()) {
    where.year = typeof filters.year === 'string' ? parseInt(filters.year.trim()) : filters.year;
  }
  if (filters.tag?.trim()) {
    where.tag = { contains: filters.tag.trim(), mode: 'insensitive' };
  }
  if (filters.conference?.trim()) {
    where.conference = { contains: filters.conference.trim(), mode: 'insensitive' };
  }
  if (filters.search?.trim()) {
    const search = filters.search.trim();
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { speaker: { contains: search, mode: 'insensitive' } },
      { conference: { contains: search, mode: 'insensitive' } },
      { tag: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.talk.findMany({
    orderBy: { title: 'asc' },
    where,
  });
}

export async function getTalkFilterOptions(): Promise<FilterOptions> {
  'use cache';

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
