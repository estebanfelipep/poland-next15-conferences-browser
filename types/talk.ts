import type { Talk } from '@prisma/client';

export type TalksResult = {
  talks: Talk[];
  totalPages: number;
};
