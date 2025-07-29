import star from '../../../../../assets/assignment/star.svg';
import { Button } from '../../../../../components/ui/button';
import profile from '../../../../../assets/assignment/Image.png';


const AllotedTutor = () => {
  return (
    <section className="bg-white rounded-lg">
      <div className="px-5 pt-5">
        <h4 className="text-[18px] font-poppinssemibold text-gray-900 mb-4">Allotted Tutor</h4>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="px-5 pb-5">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-3 items-center justify-center">
            <img src={profile} alt="profile" className='w-12 h-12 rounded-full overflow-hidden object-cover' />

            <div className="flex-1">
              <h5 className="text-md font-poppinssemibold text-gray-900">Dianne Russell</h5>
              <div className="flex items-end gap-1">
                <p className="text-xs font-poppinsregular text-gray-600">
                  Computer Science Specialist
                </p>
                <span className='w-1 h-1 bg-gray-500 rounded-full m-1.5'></span>
                <div className="flex items-center justify-center gap-1">
                  <img src={star} alt="star" className="w-3.5 h-3.5" />
                  <span className="text-sm font-poppinssemibold text-[#FD8E1F]">
                    4.9
                  </span>
                </div>
                <span className="text-[10px] font-poppinsmedium text-gray-500">
                  (50,444 Rating)
                </span>
              </div>
            </div>
            <Button variant="pill_outline" className="px-4 py-2 text-xs">
              View Profile
            </Button>
          </div>
        </div>
      </div>{' '}
    </section>
  );
};

export default AllotedTutor;
