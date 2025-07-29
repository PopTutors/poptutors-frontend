import { Ananya, Anita, Mehta, Rahul, Rating } from '../../assets';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';

const testimonials = [
  {
    name: 'Ananya',
    imageSrc: Ananya,
    place: 'Bangalore Univ.',
    testimonial: `Pop Tutors saved my GPA—fast, affordable, and plagiarism-free!`,
  },
  {
    name: 'Rahul',
    imageSrc: Rahul,
    place: 'MIT Pune',
    testimonial: `On-demand Q&A was a game-changer during finals week.`,
  },
];
const testimonials2 = [
  {
    name: 'Dr. Mehta',
    imageSrc: Mehta,
    place: 'EduTech Researcher',
    testimonial: `This platform pairs students with vetted pros—I’ve never had a smoother collaboration.`,
  },
  {
    name: 'Anita',
    imageSrc: Anita,
    place: 'Senior Data Scientist',
    testimonial: `Clear workflows and milestone payments make Pop Tutors my go-to tutoring network.`,
  },
];

export default function Carousels() {
  return (
    <div className="my-10 flex w-full flex-col items-center justify-center p-4 md:p-6 md:px-30 ">
      <div className="my-8 self-start text-3xl md:text-5xl font-bold">
        <span className="text-primary">What They&apos;re</span> Saying
      </div>
      <div className="self-start text-[#464646] text-[22px] md:text-lg font-semibold">
        Student Testimonials
      </div>
      <CustomCarousel data={testimonials} />
      <div className="self-start text-[#464646] md:text-lg font-semibold">Expert Endorsements</div>
      <CustomCarousel data={testimonials2} />
    </div>
  );
}

const CustomCarousel = ({ data }: { data: typeof testimonials2 }) => {
  return (
    <div className="my-8 w-full px-6">
      <Carousel>
        <CarouselContent className="shadow-lg">
          {data.map((testimonial, index) => (
            <CarouselItem key={index} className="basis-full md:basis-1/2 px-2">
              <CarouselCard
                imgSrc={testimonial.imageSrc}
                name={testimonial.name}
                place={testimonial.place}
                testimonial={testimonial.testimonial}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="size-12 md:size-16 translate-x-2 md:translate-x-5 shadow-lg" />
        <CarouselNext className="size-12 md:size-16 -translate-x-2 md:-translate-x-5 shadow-lg" />
      </Carousel>
    </div>
  );
};

export const CarouselCard = ({
  imgSrc,
  name,
  place,
  testimonial,
}: {
  testimonial: string;
  imgSrc: string;
  name: string;
  place: string;
}) => {
  return (
    <div className="flex h-64 w-auto flex-col justify-between rounded-md border-l-8 border-l-[#F67766] py-6 shadow-lg bg-white">
      <div className="mx-6 h-2/4 lh-7 font-regular text-[22px] border-l border-l-gray-300 px-6 text-[#5F5F7E] md:text-lg">
        {testimonial}
      </div>
      <div className="mx-6 flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 w-full">
          <img
            src={imgSrc}
            alt={name}
            width={70}
            height={70}
            className="h-12 w-12 md:h-[70px] md:w-[70px] object-contain rounded-full"
          />
          <div className="flex flex-col items-start justify-center">
            <div className="font-semibold text-[22px] text-[#5F5F7E] md:text-lg">{name}</div>
            <div className="font-semibold text-[18px] text-[#80819A] text-xs md:text-base">
              {place}
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4">
          <img
            src={Rating}
            alt="rating"
            width={70}
            height={70}
            className="h-8 w-20 md:h-[70px] md:w-[70px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};
