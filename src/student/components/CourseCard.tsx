interface CourseCardProps {
  onDetailsClick?: () => void;
  course: any;
  metadata?: any;
  title?: string;
  subject?: string;
  status?: string;
  postedBy?: any;
  assignedTo?: any;
  reviewedBy?: any;
  createdAt?: any;
  updatedAt?: any;
  pricePerHour?: any;
  liveHelpHours?: any;
  timezone?: any;
  startTime?: any;
  endTime?: any;
  universityName?: string;
  sessionAgenda?: string;
  expertiseLevel?: string;
  budget?: any;
  showJoinNow?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  metadata = {},
  title,
  subject,
  status,
  postedBy,
  assignedTo,
  reviewedBy,
  createdAt,
  updatedAt,
  pricePerHour,
  liveHelpHours,
  timezone,
  startTime,
  endTime,
  universityName,
  sessionAgenda,
  expertiseLevel,
  budget,
  showJoinNow = false,
  onDetailsClick,
}) => {
  const tags = [
    {
      label: `${course.studentId ? 'Live helps' : course.sessionType ? 'Live Session' : 'Assignments'}`,
      color: 'text-primary',
    },
    {
      label: subject || metadata.subject || course.subject || 'No Subject',
      color: 'text-green-600',
    },
  ];
  return (
    <div className="border border-gray-200 rounded-xl py-[17px] px-3 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-[16px] font-semibold text-gray-900 leading-snug">
          {title || metadata.title || course.title}
        </h3>
        <span className="text-[10px] font-poppinsregular  text-gray-500">
          {metadata.dateTime || startTime || course.date || ''}
        </span>
      </div>

      {(metadata.description || course.description) && (
        <p className="text-[10px] font-poppinsregular text-gray-400 mb-2">
          {metadata.description?.slice(0, 40) || course.description?.slice(0, 40)}
        </p>
      )}

      <div className="flex items-center justify-start space-x-2 text-sm mb-4">
        {tags?.map((tag: { label: string; color: string }, idx: number) => (
          <span
            key={idx}
            className={`font-poppinsregular text-[12px] ${tag.color} flex items-center gap-1`}
          >
            <span className="text-[#A8ADB7]">{idx % 2 === 0 ? '' : '•'}</span>
            {tag.label}
          </span>
        ))}
      </div>

      <div className="bg-[#e6f9ff] p-2 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-primary font-poppinssemibold">
            {(() => {
              const price = metadata.price || pricePerHour || course.studentPrice || budget;
              if (!price) return 'N/A';
              // If price already has a currency symbol, return as is
              if (typeof price === 'string' && price.match(/\$/)) return price;
              return `$${price}`;
            })()}
          </p>

          {liveHelpHours && (
            <p className="text-[10px] text-gray-500 font-poppinsregular">{liveHelpHours} hours</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* For Live Session, show both Join and View Details */}
          {course.sessionType || course.startTime ? (
            <>
              <button className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium bg-primary text-white">
                Join
              </button>
              <button
                className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium hover:bg-primary hover:text-white"
                onClick={onDetailsClick}
              >
                View Details
              </button>
            </>
          ) : (
            <button
              className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium hover:bg-primary hover:text-white"
              onClick={onDetailsClick}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
