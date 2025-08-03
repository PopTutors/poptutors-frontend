import { BookAlert, Clock, NotebookText, Users } from 'lucide-react';

const SessionCard = () => {
  return (
    <div className="xl:col-span-2 p-4 md:p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h2 className="text-base md:text-lg lg:text-xl font-poppinssemibold leading-tight max-w-full sm:max-w-[75%] lg:max-w-[80%]">
            Title of the session Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet
            consectetur.Lorem ipsum dolor sit amet consectetur.
          </h2>
          <span className="text-xs md:text-sm self-start sm:self-auto font-poppinsmedium text-[#39A340] bg-[#39A3401A] rounded px-2 md:px-3 py-1 whitespace-nowrap">
            Final Payment Confirmed
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3">
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">
            16 March 11 PM - 12 PM (EET), Cairo UTC +3
          </p>
          <span className="hidden sm:block font-poppinsmedium bg-black w-1 h-1 rounded-full"></span>
          <span className="text-xs font-poppinsmedium text-gray-500">Starting in 4 hours</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 md:gap-x-6 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Session Time</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">1 Hours</p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Organization</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">Lab Work</p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <NotebookText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Topic</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900 text-right">
            Beginner and Intermediate
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <BookAlert className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Mode of Help</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">English</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 md:mb-6">
        <h4 className="text-sm md:text-base font-poppinsmedium text-gray-900 mb-2">Description</h4>
        <div className="text-xs md:text-sm font-poppinsregular text-gray-700 leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur. Ut gravida morbi rhoncus aliquet sed mauris
            viverra ut. Feugiat adipiscing aliquet sagittis consectetur. Ut gravida morbi rhoncus
            aliquet sed mauris viverra ut. Feugiat adipiscing aliquet sagittis consectetur.
          </p>
        </div>
      </div>
      <div className="border-b border-gray-200 mb-4 md:mb-6"></div>

      {/* Skills */}
      <div>
        <h4 className="text-sm md:text-base font-poppinsmedium text-gray-900 mb-3 md:mb-4">
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Python', 'Computer Science', 'Coding', 'Application Development', 'React Native'].map(
            (skill) => (
              <span
                key={skill}
                className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-poppinsmedium bg-gray-100 text-gray-800 rounded"
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

export default SessionCard;
