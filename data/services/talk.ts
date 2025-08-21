import 'server-only';

import { prisma } from '@/db';
import type { FilterOptions, FilterType } from '@/types/filters';
import type { TalksResult } from '@/types/talk';
import { slow } from '@/utils/slow';
import type { Prisma } from '@prisma/client';

export async function getTalks(
  filters: FilterType = {},
  page: number = 1,
  pageSize: number = 30,
): Promise<TalksResult> {
  await slow(1000);

  const where: Prisma.TalkWhereInput = {};

  const validSpeakers = processFilterValues(filters.speaker);
  if (validSpeakers.length > 0) {
    where.speaker =
      validSpeakers.length === 1
        ? { contains: validSpeakers[0], mode: 'insensitive' }
        : { in: validSpeakers, mode: 'insensitive' };
  }

  const validYears = processYearValues(filters.year);
  if (validYears.length > 0) {
    where.year = validYears.length === 1 ? validYears[0] : { in: validYears };
  }

  const validTags = processFilterValues(filters.tag);
  if (validTags.length > 0) {
    where.tag =
      validTags.length === 1 ? { contains: validTags[0], mode: 'insensitive' } : { in: validTags, mode: 'insensitive' };
  }

  const validConferences = processFilterValues(filters.conference);
  if (validConferences.length > 0) {
    where.conference =
      validConferences.length === 1
        ? { contains: validConferences[0], mode: 'insensitive' }
        : { in: validConferences, mode: 'insensitive' };
  }

  const [talks, total] = await Promise.all([
    prisma.talk.findMany({
      orderBy: { title: 'asc' },
      select: {
        conference: true,
        createdAt: true,
        description: true,
        duration: true,
        id: true,
        slides: true,
        speaker: true,
        tag: true,
        title: true,
        videoUrl: true,
        year: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    }),
    prisma.talk.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return { talks, totalPages };
}

export async function getTalkFilterOptions(): Promise<FilterOptions> {
  const [years, tags, conferences, speakers] = await Promise.all([
    prisma.talk.groupBy({
      by: ['year'],
      orderBy: { year: 'desc' },
    }),
    prisma.talk.groupBy({
      by: ['tag'],
      orderBy: { tag: 'asc' },
      where: { tag: { not: null } },
    }),
    prisma.talk.groupBy({
      by: ['conference'],
      orderBy: { conference: 'asc' },
    }),
    prisma.talk.groupBy({
      by: ['speaker'],
      orderBy: { speaker: 'asc' },
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
      .filter(item => {
        return item.tag;
      })
      .map(item => {
        return { label: item.tag!, value: item.tag! };
      }),
    years: years.map(item => {
      return { label: item.year.toString(), value: item.year.toString() };
    }),
  };
}

function processFilterValues(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter(Boolean)
    .map(v => {
      return v.trim();
    })
    .filter(Boolean);
}

function processYearValues(value: string | string[] | undefined): number[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter(Boolean)
    .map(y => {
      return typeof y === 'string' ? parseInt(y.trim()) : y;
    })
    .filter(y => {
      return !isNaN(y);
    });
}
