import FilterTabs from '../components/ui/filterTabs';
import BookLiveHelp from './components/BookLiveHelp';
import LiveQuestionCard from './components/LiveQuestionCard';

const LiveQuestion = () => {
  return (
    <div className="flex flex-col gap-5">
      <FilterTabs tabs={['Requested', 'Completed', 'InProgress', 'Rejected']} />
      <BookLiveHelp />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <LiveQuestionCard mainColor="purple" />

        <LiveQuestionCard
          mainColor="blue"
          subject="Mathematics"
          topicName="Calculus"
          timeSlot="18 March 2 PM - 3 PM"
          hours="1 hour"
          price="$25"
          status="Available"
        />

        <LiveQuestionCard
          mainColor="green"
          subject="Physics"
          topicName="Quantum Mechanics"
          timeSlot="20 March 4 PM - 6 PM"
          hours="2 hours"
          price="$50"
          status="Booked"
        />

        <LiveQuestionCard
          mainColor="orange"
          subject="Chemistry"
          topicName="Organic Chemistry"
          timeSlot="22 March 10 AM - 11 AM"
          hours="1 hour"
          price="$35"
          status="Pending"
        />
      </div>
    </div>
  );
};

export default LiveQuestion;
