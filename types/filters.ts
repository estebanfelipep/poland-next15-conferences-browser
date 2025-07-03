export type FilterType = {
  title?: string;
  speaker?: string;
  year?: string;
  tag?: string;
  conference?: string;
};

export type FilterOptions = {
  conferences: {
    id: string;
    text: string;
  }[];
  speakers: {
    id: string;
    text: string;
  }[];
  tags: {
    id: string;
    text: string;
  }[];
  years: {
    id: string;
    text: string;
  }[];
};
