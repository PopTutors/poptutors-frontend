// components/SessionCard.tsx
import TeacherCard from './components/TeacherCard';
import { InfoIcon } from '../assets';
import AssignmentMilestone from './components/AssignmentMilestone';
import AssignmentDetails from './components/AssignmentDetails';
import DocumentList from './components/DocumentList';
import ChatPanel from './components/ChatPanel ';

const SessionCard = () => {
  const skills = [
    'Project Management',
    'Copywriting',
    'English',
    'Social Media Marketing',
    'Copy Editing',
  ];
  const teachers = Array(4).fill({
    name: 'Dianne Russell',
    price: 45,
    rating: 4.8,
    reviews: 451444,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  });
  return (
    <div className="container-fluid mx-auto">
      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 ">
        {/* Left Column - Filter tabs and content */}

        <div className="lg:col-span-4 ">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <h2 className="text-[25px] font-inter font-semibold text-gray-900 max-w-[80%]">
                Complete Website Responsive Design: from Figma to Webflow to Website Design -
                Assignment
              </h2>

              <span className="bg-green-500 font-poppinsmedium text-white text-[15px] px-3 py-1 rounded-md">
                Completed
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <div className="space-y-2">
                <p className="text-[17px] text-gray-700 font-inter font-regular">Subject Name</p>

                <div className="">
                  <p className="text-[17px] text-gray-700 font-inter font-regular">Topic Name</p>
                  <a href="#" className="text-[17px] text-gray-700 font-inter font-regular">
                    Lorem ipsumosdluchowuhvuhvcouvncoujdhvuijohuijwegfoweyefcywociywqfcv
                    wfcvwvicifificbichicidcic
                  </a>
                </div>

                <p className="text-[17px] text-gray-700 font-inter font-regular ">Skills</p>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#f8f8fd] text-primary px-6 py-1 rounded-md font-inter font-regular text-[17px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm text-orange-400 font-medium mt-1 whitespace-nowrap">
                Price to be Decided
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-lg mt-5 ">
            <div className="flex items-center gap-4 mb-4 border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-800">Select Teacher</h2>
              <button className="border border-pink-500 text-pink-500 px-4 py-1 rounded-full text-sm hover:bg-pink-50 transition">
                Pick For Me
              </button>
              <img src={InfoIcon} alt="" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
              {teachers.map((teacher, index) => (
                <TeacherCard key={index} {...teacher} />
              ))}
            </div>
          </div>

          <div className=" bg-gray-100 flex items-center justify-center mt-5">
            <AssignmentMilestone totalSteps={4} completedSteps={1} />
          </div>

          <div className="bg-gray-100 mt-5">
            <AssignmentDetails />
          </div>

          <div className="bg-gray-100 flex items-center justify-center mt-5">
            <DocumentList />
          </div>
        </div>

        {/* Right Column - Notifications and Transactions */}
        <div className="lg:col-span-2 ">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
