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
  const talks = await prisma.talk.findMany({
    select: {
      conference: true,
      speaker: true,
      tag: true,
      year: true,
    },
  });

  const conferences = new Set<string>();
  const speakers = new Set<string>();
  const tags = new Set<string>();
  const years = new Set<number>();

  for (const talk of talks) {
    conferences.add(talk.conference);
    speakers.add(talk.speaker);
    if (talk.tag) tags.add(talk.tag);
    years.add(talk.year);
  }

  return {
    conferences: Array.from(conferences)
      .sort()
      .map(conference => {
        return { label: conference, value: conference };
      }),
    speakers: Array.from(speakers)
      .sort()
      .map(speaker => {
        return { label: speaker, value: speaker };
      }),
    tags: Array.from(tags)
      .sort()
      .map(tag => {
        return { label: tag, value: tag };
      }),
    years: Array.from(years)
      .sort((a, b) => {
        return b - a;
      }) // Descending order
      .map(year => {
        return { label: year.toString(), value: year.toString() };
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
