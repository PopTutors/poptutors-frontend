// import RequestSessionForm from "../../components/forms/RequestSessionForm";

import { useState } from 'react';
import { Button } from '../components/ui/button';
import FilterTabs from '../components/ui/filterTabs';
import FilterBar from '../student/components/Filterbar';
import { LiveQuestionCard } from './components/LiveQuestionCard';
import { useFetch } from '../api';

const LiveQuestions = () => {
  const [subject, setSubject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleTabChange = (tab: string) => {
    console.log('Selected Tab:', tab);
  };

  const {
    data: liveHelpData = [],
    isLoading,
    error,
  } = useFetch<any>(
    ['livehelp', subject, startDate, endDate], // react-query key
    `/live-help?startDate=${startDate}&endDate=${endDate}`,
    true,
    { requiresAuth: true }
  );
  console.log('🚀 ~ LiveQuestions ~ liveHelpData:', liveHelpData);

  function mapStatus(apiStatus: string) {
    switch (apiStatus) {
      case 'requested':
        return 'budget'; // or your UI's equivalent
      case 'confirmed':
        return 'confirmed';
      case 'completed':
        return 'completed';
      default:
        return 'budget';
    }
  }

  function formatTimeRange(startTime: string, hours: number) {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString()} – ${end.toLocaleTimeString()}`;
  }

  function getStartNote(startTime: string) {
    const start = new Date(startTime);
    const diffHours = Math.round((start.getTime() - Date.now()) / (1000 * 60 * 60));
    return `Starting in ${diffHours} hrs`;
  }

  return (
    <div>
      {/* Top summary bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
        {/* Left: Title */}
        <div className="text-[22px] text-black font-poppinssemibold">Live Exam Help</div>

        {/* Right: Request Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
          <div>
            <h2 className="text-[14px] sm:text-[16px] font-poppinssemibold text-gray-900">
              Request Live Question Help
            </h2>
            <p className="text-[11px] font-poppinsregular text-gray-400">
              Requesting a new session to clear up ur doubts.
            </p>
          </div>

          <Button
            className="py-2 px-4 m-0 text-[16px] font-poppinsmedium"
            variant="outline_rounded"
          >
            Request
          </Button>
        </div>
      </div>

      <div></div>
      <FilterTabs
        tabs={['ALL', 'Requested', 'In Progress', 'Completed', 'Rejected']}
        defaultTab="Assignments"
        onTabChange={handleTabChange}
      />

      {/* Main grid layout */}
      <div className="bg-white mt-2 md:h-[706px] h-full scrollbar-thin rounded-md  md:overflow-y-scroll overflow-none py-2 mb-2">
        <div className=" px-4 mx-auto">
          <FilterBar
            selectedOption={subject}
            onSubjectChange={setSubject}
            startDate={startDate}
            endDate={endDate}
            onDateChange={(type, value) =>
              type === 'start' ? setStartDate(value) : setEndDate(value)
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading live help data</p>}
            {liveHelpData.map((help: any) => (
              <LiveQuestionCard
                key={help._id}
                id={help._id}
                status={mapStatus(help.status)}
                title={help.title}
                subject={help.metadata?.subject || help.subject || help.description || 'N/A'}
                topic={help.metadata?.topic || help.topic || 'General'}
                hours={help.liveHelpHours}
                time={formatTimeRange(help.createdAt, help.liveHelpHours)}
                startNote={getStartNote(help.createdAt)}
                rating={help.rating}
                showRecording={help.showRecording}
                timezone={help.timezone}
                pricePerHour={help.pricePerHour}
                negotiationPrice={help.negotiationPrice}
                finalPrice={help.finalPrice}
                review={help.review}
              />
            ))}
            {/* <LiveQuestionCard
              status="budget"
              title="Live Exam Help Type"
              subject="Computer Science"
              topic="Python Programming"
              hours={1}
              time="16 Mar 11 PM –12 PM"
              startNote="Starting in 4hrs"
            />
            <LiveQuestionCard
              status="confirmed"
              title="Live Exam Help Type"
              subject="Computer Science"
              topic="Python Programming"
              hours={1}
              time="16 Mar 11 PM –12 PM"
              startNote="Starting in 4hrs"
            />
            <LiveQuestionCard
              status="completed"
              title="Live Exam Help Type"
              subject="Computer Science"
              topic="Python Programming"
              hours={1}
              rating={4.8}
              // ratingCount={451444}
              showRecording={true}
              time=""
            /> */}
            {/* <LiveQuestionCard
              status="rejected"
              title="Live Exam Help Type"
              subject="Computer Science"
              topic="Python Programming"
              hours={1}
              time="16 Mar 11 PM –12 PM"
              startNote="Starting in 4hrs"
            /> */}
          </div>

          {/* <div className="flex font-poppinssemibold text-[13px] justify-center text-primary">
            <Button variant="ghost">See More</Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LiveQuestions;
