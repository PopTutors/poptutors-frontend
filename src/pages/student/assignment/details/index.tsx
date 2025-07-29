import { useParams, useNavigate } from 'react-router-dom';
import AssignmentCard from './components/AssignmentCard';
import { MoveLeft } from 'lucide-react';
import AllotedTutor from './components/AllotedTutor';
import PriceSection from './components/PriceSection';
import DocumentTable from './components/DocumentTable';
import ChatSection from './ChatSection';
import SelectTeacher from './components/SelectTeacher';

const AssignmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  console.log(id);

  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoveLeft strokeWidth={3} className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-poppinssemibold">Assignment Details</h1>
        </div>

        <div className="flex flex-col items-start bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-poppinssemibold text-sm text-primary">Inprogress</span>
            <span className="text-gray-400">•</span>
            <span className="font-poppinsregular text-sm text-primary">Milestone 1</span>
          </div>
          <span className="font-poppinsregular text-xs text-gray-600 mt-1">Downpayment Paid</span>
        </div>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 gap-5 flex flex-col">
          <AssignmentCard />
          <SelectTeacher />
          {/* <AllotedTutor /> */}
          <PriceSection />
          <DocumentTable />
        </div>
        <div>
          <ChatSection />
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;
