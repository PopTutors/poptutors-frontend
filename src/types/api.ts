export type Assignment = {
  id: string;
  title: string;
  description: string;
  teamId: string;
  points: number;
  dueDate: number;
};

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};
