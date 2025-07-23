import { Button } from "../../components/ui/button";

const BookLiveHelp = () => {
  return (
    <div className="flex w-[662px] h-[97px] justify-between items-center shrink-0 bg-white rounded p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px]  text-black font-poppinsregular leading-tight">
          Book Live Help
        </h2>
        <p className="text-[14px] font-normal text-black opacity-40  leading-relaxed max-w-[380px]">
          Fill up the form for requesting a new session to clear up your doubts.
        </p>
      </div>
      <Button className="text-[#AE7100] font-poppins text-[14px] not-italic font-bold leading-[150%] flex w-[154px] h-[40px] px-[21px] py-[10px] flex-col justify-center items-center gap-[8px] shrink-0 rounded-[50px] border-[3px] border-[#FFB038] bg-[#FFEACB]">
        Book Live Help
      </Button>
    </div>
  );
};

export default BookLiveHelp;
