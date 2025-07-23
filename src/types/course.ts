export type CourseType = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  price: string;
  duration?: string;
  courseCode?: string;
  buttonLabel?: string;
  highlight?: string;
};

export type TransactionType = {
  id: string;
  date: string;
  amount: string;
  status: 'Pending' | 'Completed';
};