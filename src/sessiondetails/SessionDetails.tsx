// components/SessionCard.tsx
import { FaClock, FaChartLine, FaUniversity, FaPhoneAlt } from "react-icons/fa";

const SessionCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-gray-900">Title Of Session</h2>
      <p className="text-sky-600 font-medium text-sm mt-1">
        16 March 11 PM -12 PM (EET), Cairo UTC +3
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <FaClock className="mt-1 text-gray-500" />
          <div>
            <p className="font-medium">Session Duration</p>
            <p>2 Hours</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FaChartLine className="mt-1 text-gray-500" />
          <div>
            <p className="font-medium">Subject and Topic</p>
            <p>Beginner and Intermediate</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FaUniversity className="mt-1 text-gray-500" />
          <div>
            <p className="font-medium">Organization</p>
            <p>University Of Greenwich, London</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FaPhoneAlt className="mt-1 text-gray-500" />
          <div>
            <p className="font-medium">Mode of Help</p>
            <p>Chat and Call</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-red-600 font-semibold text-sm">
        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-lg font-mono">
          01 : 24 : 14
        </div>
        <span>Hours Left</span>
      </div>

      <p className="text-gray-600 text-sm mt-4">
        Lorem ipsumosduchouwuhvuhcouvcounujdhvujohuwjefgweyefgywgcjywgfcywfcwvwv
        viciffichichicidcic
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "Project Management",
          "Copywriting",
          "English",
          "Social Media Marketing",
          "Copy Editing",
        ].map((skill) => (
          <span
            key={skill}
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex gap-4">
        <button className="px-5 py-2 border border-sky-600 text-sky-600 rounded-full text-sm font-medium">
          Reschedule
        </button>
        <button className="px-5 py-2 bg-sky-600 text-white rounded-full text-sm font-medium">
          Join Session
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
