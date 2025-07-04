export type FilterType = {
  title?: string;
  speaker?: string;
  year?: string;
  search?: string;
  tag?: string;
  conference?: string;
};

export type FilterOptions = {
  conferences: string[];
  speakers: string[];
  tags: string[];
  years: string[];
  search?: string[];
};
