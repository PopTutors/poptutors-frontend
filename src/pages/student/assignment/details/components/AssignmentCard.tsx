import { BarChartHorizontal, Calendar, Clock, FilePlus } from 'lucide-react';

const AssignmentCard = ({ assignmentData }: { assignmentData: any }) => {
  return (
    <div className="xl:col-span-2 p-5 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-poppinssemibold mb-2">
          <span className="text-primary font-poppinsbold">#{assignmentData?._id}</span>{' '}
          {assignmentData?.title}
        </h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs font-poppinsmedium text-gray-500 bg-[#e6f9ff] rounded px-3 py-1">
            {assignmentData?.courseCode}
          </span>
          <span className="text-xs font-poppinsmedium text-gray-500">{assignmentData?.course}</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-poppinsregular text-gray-500">Time</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">{assignmentData?.createdAt}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <BarChartHorizontal className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-poppinsregular text-gray-500">Assignment Type</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.assignmentType ||
              assignmentData?.assignmentType ||
              'Lab Work'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-poppinsregular text-gray-500">Deadline</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.dateTime || assignmentData?.deadline || 'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <FilePlus className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-poppinsregular text-gray-500">Additional Services</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.additionalServices ||
              assignmentData?.additionalServices ||
              'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-poppinsregular text-gray-500">Expertise Level</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.expertiseLevel || assignmentData?.expertiseLevel || 'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-poppinsregular text-gray-500">Language</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.language || assignmentData?.language || 'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-poppinsregular text-gray-500">University</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.universityName || assignmentData?.universityName || 'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-poppinsregular text-gray-500">Professor Name</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.professorName || assignmentData?.professorName || 'N/A'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-poppinsregular text-gray-500">Requirements</p>
          </div>
          <p className="text-sm font-poppinsmedium text-gray-900">
            {assignmentData?.metadata?.requirements || assignmentData?.requirements || 'N/A'}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-1">Description</h4>
        <div className="text-xs font-poppinsregular text-gray-700 leading-relaxed space-y-3">
          <p>
            {assignmentData?.description ||
              'Lorem ipsum dolor sit amet consectetur. Ut gravida morbi rhoncus aliquet sed mauris viverra ut. Feugiat adipiscing aliquet sagittis consectetur. Ut gravida morbi rhoncus aliquet sed mauris viverra ut. Feugiat adipiscing aliquet sagittis consectetur.'}
          </p>
        </div>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>

      {/* Skills */}
      <div>
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-4">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {(
            assignmentData?.metadata?.skills ||
            assignmentData?.skills || [
              'Python',
              'Computer Science',
              'Coding',
              'Application Development',
              'React Native',
            ]
          ).map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-xs font-poppinsmedium bg-gray-100 text-gray-800 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      {/* Show student price, negotiation price, final price */}
      <div className="mt-4">
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-2">Pricing</h4>
        <div className="flex flex-wrap gap-4">
          <span className="text-xs font-poppinsmedium text-gray-700 bg-[#e6f9ff] rounded px-3 py-1">
            Student Price: ${assignmentData?.studentPrice ?? 'N/A'}
          </span>
          {assignmentData?.negotiationPrice && (
            <span className="text-xs font-poppinsmedium text-gray-700 bg-[#e6f9ff] rounded px-3 py-1">
              Negotiation Price: ${assignmentData?.negotiationPrice}
            </span>
          )}
          {assignmentData?.finalPrice && (
            <span className="text-xs font-poppinsmedium text-gray-700 bg-[#e6f9ff] rounded px-3 py-1">
              Final Price: ${assignmentData?.finalPrice}
            </span>
          )}
        </div>
      </div>
      {/* Show milestones */}
      <div className="mt-4">
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-2">Milestones</h4>
        <div className="flex flex-col gap-2">
          {(assignmentData?.milestones || []).map((milestone: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-xs font-poppinsmedium text-gray-700 bg-gray-100 rounded px-2 py-1">
                {milestone.description}
              </span>
              <span className="text-xs font-poppinsregular text-gray-500">
                {milestone.percentage}%
              </span>
              <span className="text-xs font-poppinsregular text-gray-500">
                {milestone.isCompleted ? 'Completed' : 'Pending'}
              </span>
              <span className="text-xs font-poppinsregular text-gray-500">
                {milestone.paymentStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
