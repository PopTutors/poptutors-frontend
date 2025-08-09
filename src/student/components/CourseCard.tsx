
const CourseCard: React.FC<{ course: any }> = ({ course }) => {
  const tags = [
    { label: `${course.studentId ? "Live helps":"Assignments"}`, color: 'text-primary' },
    { label: 'Milestone 1', color: 'text-green-600' },
  ]
  return (
    <div className="border border-gray-200 rounded-xl py-[17px] px-3 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-[16px] font-semibold text-gray-900 leading-snug">{course.title}</h3>
        <span className="text-[10px] font-poppinsregular  text-gray-500">{course.date}</span>
      </div>

      {course.description && (
        <p className="text-[10px] font-poppinsregular text-gray-400 mb-2">{course.description}</p>
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
          <p className="text-primary font-poppinssemibold">{course.studentPrice}</p>
          <p className="text-[10px] text-gray-500 font-poppinsregular">{course.milestones?.length
            ? `${course.milestones.length} Milestones`
            : 'No milestones'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium bg-primary text-white">
            Join
          </button>
          <button className="border border-primary text-primary px-4 py-1 rounded-full text-[14px] font-poppinsmedium hover:bg-primary hover:text-white">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
