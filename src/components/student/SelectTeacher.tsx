import { Button } from '../ui/button';
import profile from '../../assets/assignment/Image.png';
import star from '../../assets/assignment/star.svg';

const SelectTeacher = () => {
  return (
    <section className="bg-white rounded-lg">
      <div>
        <div className="flex items-center justify-between px-5 pt-5">
          <h4 className="text-[18px] font-poppinssemibold text-gray-900 mb-4">Select Teacher</h4>
          <Button
            variant="pill_solid"
            className="font-poppinssemibold bg-primary text-white text-sm py-1"
          >
            Pick For Me
          </Button>
        </div>

        <div className="border-b border-gray-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
          {[
            {
              name: 'John Doe',
              rating: 4.5,
              price: 100,
            },
            {
              name: 'Jane Doe',
              rating: 4.5,
              price: 100,
            },
            {
              name: 'John Doe',
              rating: 4.5,
              price: 100,
            },
          ].map((teacher, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 items-center justify-between border border-gray-200 rounded-lg p-2"
            >
              <div className="flex items-center justify-start w-full gap-2">
                <img src={profile} alt={teacher.name} className="w-10 h-10 rounded-full" />
                <div className="flex flex-col items-start justify-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <h5 className="text-sm font-poppinssemibold text-gray-900">{teacher.name}</h5>
                    <button className="text-xs font-poppinssemibold text-primary hover:underline">
                      View Details
                    </button>
                  </div>
                  <div className="flex items-end gap-1">
                    <p className="text-xs font-poppinsregular text-gray-600">
                      Computer Science Specialist
                    </p>
                    <span className="w-1 h-1 bg-gray-500 rounded-full m-1.5"></span>
                    <div className="flex items-center justify-center gap-1">
                      <img src={star} alt="star" className="w-3.5 h-3.5" />
                      <span className="text-sm font-poppinssemibold text-[#FD8E1F]">4.9</span>
                    </div>
                    <span className="text-[10px] font-poppinsmedium text-gray-500">
                      (50,444 Rating)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full gap-2 bg-[#e6f9ff] p-3 rounded-lg">
                <div className="flex flex-col items-start justify-center">
                  <p className="text-md  font-poppinssemibold text-primary">$100</p>
                  <span className="text-xs font-poppinsmedium text-gray-500">Price</span>
                </div>
                <Button variant="pill_outline" className="font-poppinsmedium text-sm py-1 m-0">
                  Book Teacher
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectTeacher;
