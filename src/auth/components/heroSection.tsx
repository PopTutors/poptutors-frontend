import {
  CalenderIcon,
  GroupIcon,
  Hero,
  PageIcon,
  SearchIcon,
} from "../../assets";

const HeroSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-accent invisible absolute h-full w-full items-start justify-center md:visible md:static md:col-span-7 md:flex">
      <div className="relative flex h-[85%] w-8/12 flex-col items-center justify-start gap-6 rounded border-2 border-dashed border-border">
        <img
          src={Hero}
          alt="login-image"
          // width={400}
          // height={600}
          className="h-[87%]   w-auto"
        />

        {/* Positioned Floating Icons */}
        <img
          src={CalenderIcon}
          alt="calendar"
          width={100}
          height={600}
          className="absolute top-[20%] left-0 -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={PageIcon}
          alt="page"
          width={90}
          height={600}
          className="absolute top-[60%] left-0 -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={SearchIcon}
          alt="search"
          width={90}
          height={600}
          className="absolute right-0 top-[40%] translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={GroupIcon}
          alt="group"
          width={110}
          className="absolute right-0 top-[80%] translate-x-1/2 -translate-y-1/2"
        />

        {/* Optional second Calendar icon — removed unless needed */}
        

        {/* Dynamic children (e.g. form, text) */}
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
