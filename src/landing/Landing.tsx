import {
  Assignmentsupport,
  OneonOne,
  livequestionshelp,
} from "../assets";
import Features from "./components/Features";
import Footer from "./components/Footer";
import DashboardHero from "./components/HeroSection";
import PainPoints from "./components/PainPoints";
import FadeInSection from "./components/animations/FadeInSection";
import Carousels from "./components/Carousels";
import Navbar from "./components/navbar/Navbar";

const assignMentSteps = [
  { step: "Submit brief & files" },
  { step: "We refine & post to tutors" },
  { step: "Tutors apply & negotiate" },
  { step: "Pay Milestone 1" },
  { step: "Receive draft → Revise → Final payment & delivery" },
];

export default function Page() {
  return (
    <div style={{backgroundColor: "#ffffff"}} className="flex w-full flex-col px-3 sm:px-1">
      <Navbar />
      <DashboardHero />
      <FadeInSection delay={0.1}>

      <div className="my-8 text-center text-3xl font-bold md:px-10 md:text-5xl">
        <span className="text-primary">Services </span>
        <span className="text-black">We Offer</span>
        <div className="mt-4 text-sm font-regular text-[#464646] sm:text-2xl">
          Poptutors is one powerful online tool suite that combines all the
          experts <br className="hidden sm:block" /> needed to complete a
          successful assignment or project.
        </div>
      </div>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <Features
          steps={assignMentSteps}
          imageSrc={Assignmentsupport}
          titleOne="Assignment"
          titleTwo="Support"
          caption={`Got an assignment but no time to solve it?\nDon’t worry , we got you😉`}
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <Features
          direction="right"
          steps={assignMentSteps}
          imageSrc={livequestionshelp}
          titleOne="Live Question"
          titleTwo=" Help"
          caption={`Discuss your questions/doubts with experts\nand get the solution in real time.`}
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <Features
          steps={assignMentSteps}
          imageSrc={OneonOne}
          titleOne="1-on-1"
          titleTwo="Sessions"
          caption={`Any subject, any topic—we’ve got you covered\n to teach you in your style.`}
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <PainPoints />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <Carousels />
      </FadeInSection>

      <Footer />
    </div>
  );
}
