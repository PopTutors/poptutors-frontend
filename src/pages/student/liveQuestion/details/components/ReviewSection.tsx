import star from '../../../../../assets/assignment/star.svg';
import RatingStars from '../../../../../components/ui/RatingStars';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import Textarea from '../../../../../components/ui/textarea';

interface ReviewSectionProps {
  review?: string;
}

const ReviewSection = ({ review }: ReviewSectionProps) => {
  const onSubmitFeedback = () => {
    console.log('submit feedback');
  };
  return (
    <section className="bg-white rounded-lg">
      <div className="px-3 sm:px-5 pt-3 sm:pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h4 className="text-lg sm:text-xl md:text-[22px] font-poppinsmedium text-gray-900 mb-2 sm:mb-4">
          Reviews & Feedback
        </h4>
        {/* rating section   */}
        <div className="flex justify-start sm:justify-end">
          <RatingStars rating={4.5} outOf={5} starImage={star} />
        </div>
      </div>
      <div className="px-3 sm:px-5 pb-3 sm:pb-5 flex flex-col gap-3 sm:gap-4">
        {review && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm sm:text-base md:text-[16px] font-poppinsmedium mb-2">
              Existing Review
            </Label>
            <div className="text-xs sm:text-sm text-gray-700 font-poppinsregular">{review}</div>
          </div>
        )}
        <div>
          <Label className="text-sm sm:text-base md:text-[16px] font-poppinsmedium mb-2">
            Feedback Comments
          </Label>
          <Textarea
            placeholder="Write here..."
            rows={4}
            className="border-gray-200 text-sm sm:text-base"
          />
        </div>
        <Button
          variant="pill_outline"
          className="text-sm sm:text-base md:text-[16px] font-poppinsmedium w-full sm:w-fit self-stretch sm:self-end px-4 py-2 sm:py-1"
          onClick={onSubmitFeedback}
        >
          Submit Feedback
        </Button>
      </div>
    </section>
  );
};

export default ReviewSection;
