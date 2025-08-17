import { Button } from '../ui/button';
import profile from '../../assets/assignment/Image.png';
import star from '../../assets/assignment/star.svg';
import { Loader2, AlertCircle } from 'lucide-react';
import { useFetch } from '../../api/UseFetch';

// TypeScript types
interface Teacher {
  id?: string;
  name: string;
  rating: number;
  price: number;
  totalRating: number;
  specialization: string;
  profileImage?: string;
}

type UsedAtType = 'assignment' | 'session' | 'live-help';

interface SelectTeacherProps {
  id?: string;
  usedAt: UsedAtType;
  title?: string;
  showPickForMeButton?: boolean;
}

const SelectTeacher = ({
  id,
  usedAt,
  title = 'Select Teacher',
  showPickForMeButton = true,
}: SelectTeacherProps) => {
  // Determine API endpoint based on usedAt type
  const apiEndpoint = id
    ? usedAt === 'assignment'
      ? `/assignments/${id}/suggested-teachers`
      : usedAt === 'session'
        ? `/sessions/${id}/suggested-teachers`
        : `/live-help/${id}/suggested-teachers`
    : '/assignments/dummy/suggested-teachers';

  const {
    data: suggestedTutors = [],
    isLoading,
    error,
  } = useFetch<Teacher[]>(
    ['suggested-tutors', usedAt, id], // react-query key
    apiEndpoint,
    !!id, // Only enable the query if id is available
    { requiresAuth: true }
  );

  console.log('suggestedTutors', suggestedTutors);
  return (
    <section className="bg-white rounded-lg">
      <div>
        <div className="flex items-center justify-between px-5 pt-5">
          <h4 className="text-[18px] font-poppinssemibold text-gray-900 mb-4">{title}</h4>
          {showPickForMeButton && (
            <Button
              variant="pill_solid"
              className="font-poppinssemibold bg-primary text-white text-sm py-1"
            >
              Pick For Me
            </Button>
          )}
        </div>

        <div className="border-b border-gray-200"></div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-gray-600 font-poppinsmedium text-sm">
                Loading suggested teachers...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-gray-900 font-poppinssemibold text-sm mb-1">
                  Failed to load teachers
                </p>
                <p className="text-gray-600 font-poppinsregular text-xs">
                  {error?.message || 'Something went wrong while loading suggested teachers.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
            {(suggestedTutors?.length > 0
              ? suggestedTutors
              : [
                  {
                    name: 'John Doe',
                    rating: 4.5,
                    price: 100,
                    totalRating: 50444,
                    specialization: 'Computer Science Specialist',
                  },
                  {
                    name: 'Jane Doe',
                    rating: 4.5,
                    price: 100,
                    totalRating: 50444,
                    specialization: 'Computer Science Specialist',
                  },
                  {
                    name: 'John Doe',
                    rating: 4.5,
                    price: 100,
                    totalRating: 50444,
                    specialization: 'Computer Science Specialist',
                  },
                ]
            ).map((teacher: Teacher, index: number) => (
              <div
                key={teacher.id || index}
                className="flex flex-col gap-3 items-center justify-between border border-gray-200 rounded-lg p-2"
              >
                <div className="flex items-center justify-start w-full gap-2">
                  <img
                    src={teacher.profileImage || profile}
                    alt={teacher.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col items-start justify-start w-full">
                    <div className="flex items-center justify-between w-full">
                      <h5 className="text-sm font-poppinssemibold text-gray-900">
                        {teacher?.name ?? 'Demo User'}
                      </h5>
                      <button className="text-xs font-poppinssemibold text-primary hover:underline">
                        View Details
                      </button>
                    </div>
                    <div className="flex items-end gap-1">
                      <p className="text-xs font-poppinsregular text-gray-600">
                        {teacher?.specialization ?? 'Demo User Specialization'}
                      </p>
                      <span className="w-1 h-1 bg-gray-500 rounded-full m-1.5"></span>
                      <div className="flex items-center justify-center gap-1">
                        <img src={star} alt="star" className="w-3.5 h-3.5" />
                        <span className="text-sm font-poppinssemibold text-[#FD8E1F]">
                          {teacher?.rating ?? '4.5'}
                        </span>
                      </div>
                      <span className="text-[10px] font-poppinsmedium text-gray-500">
                        ({teacher?.totalRating ?? '50444'} Rating)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full gap-2 bg-[#e6f9ff] p-3 rounded-lg">
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-md font-poppinssemibold text-primary">
                      ${teacher?.price ?? '100'}
                    </p>
                    <span className="text-xs font-poppinsmedium text-gray-500">Price</span>
                  </div>
                  <Button variant="pill_outline" className="font-poppinsmedium text-sm py-1 m-0">
                    Book Teacher
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectTeacher;
