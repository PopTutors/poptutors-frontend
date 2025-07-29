type StatusBadgeProps = {
  status: 'Completed' | 'Requested' | 'Negotiate';
};

const statusStyles = {
  Completed: 'bg-green-100 text-green-600',
  Requested: 'bg-blue-100 text-blue-600',
  Negotiate: 'bg-red-100 text-red-600',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
