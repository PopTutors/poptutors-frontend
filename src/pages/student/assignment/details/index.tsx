import { useParams, useNavigate } from 'react-router-dom';
import AssignmentCard from './components/AssignmentCard';
import { MoveLeft, Loader2, AlertCircle } from 'lucide-react';
import SelectTeacher from '../../../../components/student/SelectTeacher';
import PriceSection from '../../../../components/student/PriceSection';
import DocumentTable from '../../../../components/student/DocumentTable';
import ChatSection from '../../../../components/ChatSection';
import { useFetch } from '../../../../api/UseFetch';

const AssignmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: assignmentDetails = {},
    isLoading,
    error,
  } = useFetch<any>(
    ['assignment-details', id], // react-query key
    `/assignments/${id}`,
    true,
    { requiresAuth: true }
  );

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-600 font-poppinsmedium">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-poppinssemibold text-gray-900 mb-2">
              Failed to load assignment
            </h3>
            <p className="text-gray-600 font-poppinsregular">
              {error?.message || 'Something went wrong while loading the assignment details.'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg font-poppinsmedium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log(assignmentDetails);

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
          <AssignmentCard assignmentData={assignmentDetails} />
          <SelectTeacher id={id} usedAt="assignment" />
          {/* <AllotedTutor /> */}
          <PriceSection />
          <DocumentTable attachments={assignmentDetails?.attachments} />
        </div>
        <div className="flex flex-col gap-5">
          <ChatSection />
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;
