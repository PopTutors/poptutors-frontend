import { BarChartHorizontal, Calendar, Clock, FilePlus } from 'lucide-react';

const AssignmentCard = () => {
  return (
    <div className="xl:col-span-2 p-5 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-poppinssemibold mb-2">
          <span className="text-primary font-poppinsbold">#81436</span> New swift assignment –
          iOS Programming New swift assignment – iOS Programming
        </h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs font-poppinsmedium text-gray-500 bg-[#e6f9ff] rounded px-3 py-1">
            CS101
          </span>
          <span className="text-xs font-poppinsmedium text-gray-500">Computer Science</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-poppinsregular text-gray-500">Time</p>
            </div>
            <p className="text-sm font-poppinsmedium text-gray-900">20 April 2024</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-2">
            <BarChartHorizontal className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-poppinsregular text-gray-500">Assignment Type</p>
            </div>
            <p className="text-sm font-poppinsmedium text-gray-900">Lab Work</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-poppinsregular text-gray-500">Deadline</p>
            </div>
            <p className="text-sm font-poppinsmedium text-gray-900">25 April 2024</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-2">
              <FilePlus className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-poppinsregular text-gray-500">Additional Services</p>
            </div>
            <p className="text-sm font-poppinsmedium text-gray-900">English</p>
          </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-1">Description</h4>
        <div className="text-xs font-poppinsregular text-gray-700 leading-relaxed space-y-3">
          <p>
            Lorem ipsum dolor sit amet consectetur. Ut gravida morbi rhoncus aliquet sed mauris
            viverra ut. Feugiat adipiscing aliquet sagittis consectetur. Ut gravida morbi rhoncus
            aliquet sed mauris viverra ut. Feugiat adipiscing aliquet sagittis consectetur.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Ut gravida morbi rhoncus aliquet sed mauris
            viverra ut. Feugiat adipiscing aliquet sagittis consectetur. Ut gravida morbi rhoncus
            aliquet sed mauris viverra ut. Feugiat adipiscing aliquet sagittis consectetur.
          </p>
        </div>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>


      {/* Skills */}
      <div>
        <h4 className="text-sm font-poppinsmedium text-gray-900 mb-4">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {['Python', 'Computer Science', 'Coding', 'Application Development', 'React Native'].map(
            (skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-poppinsmedium bg-gray-100 text-gray-800 rounded"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
