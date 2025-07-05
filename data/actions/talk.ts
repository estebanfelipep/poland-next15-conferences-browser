'use server';

import type { FilterType } from '@/types/filters';
import { getTalks } from '../services/talk';

export async function getTalksAction(filters: FilterType = {}, page: number) {
  return getTalks(filters, page);
}
