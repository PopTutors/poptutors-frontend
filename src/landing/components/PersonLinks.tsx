import { Arrow, Calenderlanding, Clickhere, LandingPageIcon, Livequestionlanding, MailIcon, Person, Recorder } from "../../assets"


const PersonLinks = () => {
  return (
    <div className="z-10 flex w-full translate-y-16 justify-center p-12 md:p-2">
      <div className="relative">
        <img
          src={Person}
          alt="person-image"
          className="w-64 md:w-86 2xl:w-96"
        />

        <img
          src={Calenderlanding}
          alt="question-image"
          className="absolute top-8 -left-8 w-6 md:top-10 md:-left-16 md:w-8"
        />

        <img
          src={Livequestionlanding}
          alt="question-image"
         
          className="absolute top-20 -right-6 w-12 md:top-28 md:-right-10 md:w-18"
        />

        {/* Assignment Help Card */}
        <div className="absolute  left-0 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-[#23BDEE]/80 p-2 text-white text-xs md:top-28 md:gap-2 md:p-4 md:text-base">
          <a href="/assignment-help">
            <div className="flex items-center gap-1 md:gap-2">
              <img
                src={LandingPageIcon}
                alt="page-image"
                width={100}
                height={100}
                className="w-5 md:w-7"
              />
              <span className="whitespace-nowrap">Assignment Help</span>
            </div>
          </a>
          <div className="hidden md:block">
            <img
              src={Arrow}
              alt="arrow-image"
              className="absolute top-20 left-0 w-12"
            />
            <img
              src={Clickhere}
              alt="arrow-image"
              className="absolute  top-32 -left-20 w-18"
            />
          </div>
        </div>

        {/* Sessions Card */}
        <div className="absolute bottom-20 left-0 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-[#41BE90]/80 p-2 text-white text-xs md:bottom-28 md:gap-2 md:p-4 md:text-base">
          <a href="/one-on-one-sessions">
            <div className="flex items-center gap-1 md:gap-2">
              <img
                src={Recorder}
                alt="recorder-icon"
                width={100}
                height={100}
                className="w-5 md:w-7"
              />
              <span className="whitespace-nowrap">Sessions(One on One)</span>
            </div>
          </a>
          <div className="hidden md:block">
            <img
              src={Arrow}
              alt="arrow-image"
              style={{ rotate: "72deg", transform: "rotatey(-180deg)" }}
              className="absolute top-20 left-0 w-12"
            />
            <img
              src={Clickhere}
              alt="arrow-image"
              className="absolute top-36 -left-5 w-18"
            />
          </div>
        </div>

        {/* Live Question Solving Card */}
        <div className="absolute top-36 right-0 flex translate-x-1/2 items-center gap-1 rounded-lg bg-[#F88C3D]/80 p-2 text-white text-xs md:top-52 md:gap-2 md:p-4 md:text-base">
          <a href="/one-on-one-sessions">
            <div className="flex items-center gap-1 md:gap-2">
              <img
                src={MailIcon}
                alt="mail-image"
                width={100}
                height={100}
                className="w-5 md:w-7"
              />
              <span className="whitespace-nowrap">Live Question Solving</span>
            </div>
          </a>
          <div className="hidden md:block">
            <img
              src={Arrow}
              alt="arrow-image"
                            style={{ rotate: "-10deg", transform: "rotatey(-165deg)" }}

              className="absolute top-20 right-0 w-18"
            />
            <img
              src={Clickhere}
              alt="arrow-image"
              className="absolute top-36 -right-8 w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonLinks