export type CourseType = {
  id: string;
  title: string;
  date: string;
  subtitle: string;
  tags: string[
    { label: string; color: string }
  ];
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