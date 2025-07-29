// import RequestSessionForm from "../../components/forms/RequestSessionForm";
import { Button } from "../../components/ui/button";
import FilterTabs from "../../components/ui/filterTabs";
import FilterBar from "../../student/components/Filterbar";
import SessionCard from "./components/SessionCard";

const SessionPage = () => {
  const handleTabChange = (tab: string) => {
    console.log("Selected Tab:", tab);
  };
  return (
    <div>
      {/* Top summary bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
        {/* Left: Title */}
        <div className="text-[22px] text-black font-poppinssemibold">
          My Sessions
        </div>

        {/* Right: Request Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
          <div>
            <h2 className="text-[14px] sm:text-[16px] font-poppinssemibold text-gray-900">Request New Sessions</h2>
            <p className="text-[11px] font-poppinsregular text-gray-400">Fill the form to request an Sessions</p>
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
        tabs={["ALL", "Requested", "In Progress", "Completed", "Rejected"]}
        defaultTab="Assignments"
        onTabChange={handleTabChange}
      />

      {/* Main grid layout */}
      <div className="bg-white mt-2 md:h-[706px] h-full scrollbar-thin rounded-md  md:overflow-y-scroll overflow-none py-2 mb-2">
        <div className=" px-4 mx-auto">
          <FilterBar />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 4hrs"
              ctaType="reschedule"
              onClick={() => alert("Reschedule")}
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="completed"
              sessionLength="1hrs Sessions"
              rating={4.8}
              ratingCount={451444}
              ctaType="recordings"
              onClick={() => alert("Recordings")}
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 2 Hrs"
              ctaType="reschedule"
              disabled
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar – 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 50 mins"
              ctaType="join"
              onClick={() => alert("Join Now")}
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 4hrs"
              ctaType="reschedule"
              onClick={() => alert("Reschedule")}
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="completed"
              sessionLength="1hrs Sessions"
              rating={4.8}
              ratingCount={451444}
              ctaType="recordings"
              onClick={() => alert("Recordings")}
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 2 Hrs"
              ctaType="reschedule"
              disabled
            />

            <SessionCard
              title="Lorem ipsum dolor sit amet consectetur. Velit mole amet adeiscing etiam nam"
              subtitle="Description - Problem solving on library"
              status="budget"
              datetime="16 Mar – 11 PM – 12 PM"
              timezone="(EET), Cairo UTC +3"
              timeNote="Starting in 50 mins"
              ctaType="join"
              onClick={() => alert("Join Now")}
            />
          </div>

          <div className="flex font-poppinssemibold text-[13px] justify-center text-primary">
            <Button variant="ghost">See More</Button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SessionPage;
