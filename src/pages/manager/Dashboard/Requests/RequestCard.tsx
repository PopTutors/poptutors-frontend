interface RequestCardProps {
  title: string;
  price: string;
  date: string;
  deadline: string;
  status: string;
  subject: string;
}

function RequestCard({ title, price, date, deadline, status, subject }: RequestCardProps) {
  return (
    <div className="bg-white border border-black/10 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-mentoos-text-primary line-clamp-1 mb-1.5">
            {title}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1.5 bg-mentoos-status-danger/5 border border-mentoos-status-danger text-mentoos-status-danger text-xs font-medium rounded-full">
              Exam help
            </span>
            <span className="text-mentoos-text-primary/70 text-sm">•</span>
            <span className="text-sm font-semibold text-mentoos-primary">{price}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/10" />

      {/* Details */}
      <div className="flex flex-col gap-4">
        {/* First Row */}
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{date}</div>
            <div className="text-sm text-mentoos-text-secondary">Date</div>
          </div>
          <div className="w-px h-9 bg-black/10" />
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{status}</div>
            <div className="text-sm text-mentoos-text-secondary">Status</div>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{deadline}</div>
            <div className="text-sm text-mentoos-text-secondary">Deadline</div>
          </div>
          <div className="w-px h-9 bg-black/10" />
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{subject}</div>
            <div className="text-sm text-mentoos-text-secondary">Subject</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestCards() {
  const requests = [
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: 'TBD',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: 'TBD',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
    },
  ];

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-mentoos-text-primary">New Requests</h2>
        <button className="text-xl text-mentoos-text-primary hover:text-mentoos-primary transition-colors">
          View all
        </button>
      </div>

      {/* Grid of Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request, index) => (
          <RequestCard
            key={index}
            title={request.title}
            price={request.price}
            date={request.date}
            deadline={request.deadline}
            status={request.status}
            subject={request.subject}
          />
        ))}
      </div>
    </div>
  );
}
