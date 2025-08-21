export type FilterType = {
  conference?: string | string[];
  speaker?: string | string[];
  tag?: string | string[];
  year?: string | string[];
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
};
