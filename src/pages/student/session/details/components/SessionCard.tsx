import { BookAlert, Clock, NotebookText, Users } from 'lucide-react';
import {
  formatTimeRange,
  calculateDuration,
  getTimeUntilSession,
  formatTimezone,
  getSessionStatus,
} from '../../../../../utils/sessionUtils';

interface SessionData {
  _id: string;
  topic: string;
  subject: string;
  startTime: string;
  endTime: string;
  timezone: string;
  sessionType: string;
  expertiseLevel: string;
  language: string;
  skillsRequired: string[];
  budget: number;
  isNegotiable: boolean;
  requestedBy: {
    _id: string;
    name: string;
    email: string;
  };
  attendees: any[];
  documents: any[];
  createdAt: string;
  updatedAt: string;
  universityName: string;
  sessionAgenda: string;
  additionalServices?: string;
  requirements?: string;
  review?: string;
}

interface SessionCardProps {
  session: SessionData;
}

const SessionCard = ({ session }: SessionCardProps) => {
  const sessionStatus = getSessionStatus(session.startTime, session.endTime);
  const timeRange = formatTimeRange(session.startTime, session.endTime, session.timezone);
  const duration = calculateDuration(session.startTime, session.endTime);
  const timeUntilSession = getTimeUntilSession(session.startTime);
  const formattedTimezone = formatTimezone(session.timezone);

  return (
    <div className="xl:col-span-2 p-4 md:p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h2 className="text-base md:text-lg lg:text-xl font-poppinssemibold leading-tight max-w-full sm:max-w-[75%] lg:max-w-[80%]">
            {session.topic || 'Session Topic'}
          </h2>
          <span
            className="text-xs md:text-sm self-start sm:self-auto font-poppinsmedium rounded px-2 md:px-3 py-1 whitespace-nowrap"
            style={{
              color: sessionStatus.color,
              backgroundColor: `${sessionStatus.color}1A`,
            }}
          >
            {sessionStatus.status}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3">
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">
            {timeRange} ({formattedTimezone})
          </p>
          <span className="hidden sm:block font-poppinsmedium bg-black w-1 h-1 rounded-full"></span>
          <span className="text-xs font-poppinsmedium text-gray-500">{timeUntilSession}</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 md:gap-x-6 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Session Time</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">{duration}</p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Organization</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">
            {session.sessionType || 'Lab Work'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <NotebookText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Topic</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900 text-right">
            {session.expertiseLevel || 'Beginner and Intermediate'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center justify-start gap-2">
            <BookAlert className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-poppinsregular text-gray-500">Mode of Help</p>
          </div>
          <p className="text-xs md:text-sm font-poppinsmedium text-gray-900">
            {session.language || 'English'}
          </p>
        </div>
      </div>

      {/* Description & Metadata */}
      <div className="mb-4 md:mb-6">
        <h4 className="text-sm md:text-base font-poppinsmedium text-gray-900 mb-2">Description</h4>
        <div className="text-xs md:text-sm font-poppinsregular text-gray-700 leading-relaxed space-y-1">
          <p>
            <span className="font-poppinssemibold">Subject:</span>{' '}
            {session.subject || 'Mathematics'}
          </p>
          <p>
            <span className="font-poppinssemibold">Topic:</span>{' '}
            {session.topic || 'Calculus Basics'}
          </p>
          <p>
            <span className="font-poppinssemibold">University:</span>{' '}
            {session.universityName || 'N/A'}
          </p>
          <p>
            <span className="font-poppinssemibold">Session Agenda:</span>{' '}
            {session.sessionAgenda || 'N/A'}
          </p>
          {session.additionalServices && (
            <p>
              <span className="font-poppinssemibold">Additional Services:</span>{' '}
              {session.additionalServices}
            </p>
          )}
          {session.requirements && (
            <p>
              <span className="font-poppinssemibold">Requirements:</span> {session.requirements}
            </p>
          )}
        </div>
      </div>
      <div className="border-b border-gray-200 mb-4 md:mb-6"></div>

      {/* Skills */}
      <div>
        <h4 className="text-sm md:text-base font-poppinsmedium text-gray-900 mb-3 md:mb-4">
          Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {session.skillsRequired && session.skillsRequired.length > 0 ? (
            session.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-poppinsmedium bg-gray-100 text-gray-800 rounded"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs md:text-sm font-poppinsregular text-gray-500">
              No specific skills mentioned
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
