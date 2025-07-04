export type FilterType = {
  title?: string;
  speaker?: string;
  year?: string;
  search?: string;
  tag?: string;
  conference?: string;
};

export type FilterOption = {
  id: string;
  text: string;
};

export type FilterOptions = {
  conferences: FilterOption[];
  speakers: FilterOption[];
  tags: FilterOption[];
  years: FilterOption[];
  search?: FilterOption[];
};
