type DashboardCardProps = {
  title: string;
  label: string;
  date: string;
  price: string;
  status: string;
  progress: string;
};

const DashboardCard = ({ title, label, date, price, status, progress }: DashboardCardProps) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h4 className="text-sm text-gray-700 mb-1">{title}</h4>
    <div className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded w-fit mb-2">{label}</div>
    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
      <span>{date}</span>
      <span>{price}</span>
    </div>
    <div className="text-xs text-gray-600 mb-2">{progress}</div>
    <button className="text-blue-600 border border-blue-600 px-4 py-1 rounded text-sm">View Details</button>
  </div>
);
export default DashboardCard;
