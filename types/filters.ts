export type FilterType = {
  conference?: string;
  search?: string;
  speaker?: string;
  tag?: string;
  year?: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterOptions = {
  conferences: FilterOption[];
  speakers: FilterOption[];
  tags: FilterOption[];
  years: FilterOption[];
  search?: FilterOption[];
};
