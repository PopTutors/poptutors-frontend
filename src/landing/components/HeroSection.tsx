import { Fiverr, PeopleperHour, Phonecall, Teacheron, Upwork, Whatsapp } from "../../assets";
import { Button } from "../../components/ui/button";
import { cn } from "../../utils/cn";
import PersonLinks from "./PersonLinks";
import SocialLinks from "./SocialLinks";

const gigSites = [
  { image: Upwork },
  { image: Fiverr },
  { image: PeopleperHour },
  { image: Teacheron },
];

const DashboardHero = () => {
  return (
    <div className="relative w-full">
      <div className="bg-accent flex flex-col-reverse items-center justify-center gap-8 p-6 md:flex-row md:px-20 lg:px-30">
        {/* Left Side: Text & Buttons */}
        <div className="flex w-full flex-col items-center md:items-start gap-4 text-center md:text-left">
          <div className="text-4xl mt-6 font-bold text-[#1e2939] sm:text-5xl 2xl:text-6xl ">
            Get Real-Time <br/> Academic Help
            <div className="text-primary">Anytime, Anywhere!</div>
            <div className="mt-6 text-base font-normal text-gray-500 sm:text-lg">
              <span className="font-bold text-gray-600">PopTutors</span>, One stop solution to{" "}
              <span className="font-bold text-gray-600">Learn</span> and{" "}
              <span className="font-bold text-gray-600">Earn</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Button className="rounded-full bg-[#23BDEE]/80 px-6 font-semibold h-full">
              <a href="https://wa.me/+918669013441" className="text-white text-lg">
                Contact us
              </a>
            </Button>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/+918669013441" className="text-white text-lg">
                <img
                  src={Whatsapp}
                  alt="WhatsApp Icon"
                  width={30}
                  height={30}
                  className="size-7 transition-transform duration-300 hover:scale-110"
                />
              </a>
              <a href="tel:+918669013441" className="text-white text-lg">
                <img
                  src={Phonecall}
                  alt="Phone Icon"
                  width={30}
                  height={30}
                  className="size-5 transition-transform duration-300 hover:scale-110"
                />
              </a>
            </div>
          </div>

          <SocialLinks />
        </div>

        {/* Right Side: Person Image / Illustration */}
        <div className="w-full flex justify-center md:justify-end">
          <PersonLinks />
        </div>
      </div>

      {/* Wavy SVG Divider */}
      <svg
        className="h-[60px] w-full rotate-180"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,100 Q720,0 1440,100 L1440,100 L0,100 Z"
          fill="currentColor"
          className="text-[#e6f9ff]"
        />
      </svg>

      {/* Gig Sites Logos */}
      <div className="mb-4 flex w-full items-center justify-around gap-3 p-6 md:px-12">
        {gigSites.map((site, index) => (
          <img
            key={index}
            src={site.image}
            width={1000}
            height={1000}
            alt={`Gig site ${index + 1}`}
            className={cn(
              "h-auto sm:w-[8%] w-[20%] object-contain",
              index === 2 ? "w-[14%]" : ""
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHero;
