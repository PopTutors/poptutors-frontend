import { useParams, useNavigate } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import ChatSection from '../../../../components/ChatSection';
import { Button } from '../../../../components/ui/button';
import SelectTeacher from '../../../../components/student/SelectTeacher';
import PriceSection from '../../../../components/student/PriceSection';
import DocumentTable from '../../../../components/student/DocumentTable';
import ReviewSection from './components/ReviewSection';
import { useFetch } from '../../../../api';
import LiveHelpCard from './components/LiveHelpCard';
import LiveHelpNote from './components/LiveHelpNotes';

// Using any type for now as requested

const LiveQuestionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch session details
  const {
    data: liveHelp,
    isLoading,
    error,
    hasError,
  } = useFetch<any>(
    ['live-help-details', id], // react-query key
    `/live-help/${id}`,
    !!id, // Only fetch if id exists
    {
      requiresAuth: true,
      onErrorCallback: (error) => {
        console.error('Error fetching session details:', error);
      },
    }
  );

  console.log(liveHelp);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading live help details...</div>
      </div>
    );
  }

  // Show error state
  if (hasError || error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">
          {error?.message || 'Failed to load live help details'}
        </div>
      </div>
    );
  }

  // Show not found state
  if (!liveHelp) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Live help not found</div>
      </div>
    );
  }

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
          <h1 className="text-xl font-poppinssemibold">Live Question Help Details</h1>
        </div>

        <div>
          <Button variant="pill_outline" className="font-poppinsmedium py-3 px-10 text-sm">
            Redirect to WhatsApp
          </Button>
          <Button
            variant="pill_solid"
            className="font-poppinsmedium py-3 px-10 text-sm bg-primary text-white"
          >
            Join Call
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 gap-5 flex flex-col">
          <LiveHelpCard liveHelp={liveHelp} />
          <SelectTeacher id={id} usedAt="live-help" />
          <ReviewSection />
          {/* <AllotedTutor /> */}
          <PriceSection />
          <DocumentTable documents={liveHelp?.documents || []} />
        </div>
        <div className="flex flex-col gap-5">
          <ChatSection />
          <LiveHelpNote session={liveHelp} />
        </div>
      </div>
    </div>
  );
};

export default LiveQuestionDetailsPage;
