
import { logowhite } from "../../assets";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SocialLinks from "./SocialLinks";


export default function Footer() {
  return (
    <div className="my-8 flex w-full flex-col items-center justify-center">
      <div className="bg-primary w-full p-4 text-center text-[22px] font-semibold text-white">
        Secure Payments • 100% Money-Back Guarantee • 24/7 Support
      </div>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-2 bg-[#252641] px-4 md:px-30 py-8">
          <div className="flex flex-col items-start justify-center gap-4 w-full md:w-auto">
            <img
              src={logowhite}
              alt="logo-image"
              width={500}
              height={500}
              className="h-auto w-[50%] grow -translate-x-3 object-contain"
            />
            <div className="space-y-1 ">
              <div className=" font-semibold text-white text-[22px] ">
                Ready to Level Up Your Learning?
              </div>
              <div className="text-white text-[18px] font-medium">
                Get Started on Poptutors.co
              </div>
            </div>
            <SocialLinks />
          </div>
          <div className="flex flex-col items-start justify-center gap-4 self-start w-full md:w-auto">
            <div className="text-[22px] font-medium text-[#B2B3CF]">
              Subscribe to get our Newsletter
            </div>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full md:w-auto">
              <Input
                className="w-full xs:w-[20rem] rounded-full border-[#83839A] text-[#83839A]"
                placeholder="Your Email"
              />
              <Button className="rounded-full font-semibold text-white w-full xs:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-[#252641] p-4 text-center text-sm text-[#B2B3CF]">
          <span className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-10 text-[#B2B3CF]">
            <span className="hover:text-white">Careers </span>
            <span className="hidden xs:inline">|</span>
            <span className="hover:text-white">Privacy Policy</span>
            <span className="hidden xs:inline">|</span>
            <span className="hover:text-white">Terms & Conditions</span>
          </span>
          <div className="my-4">© 2025 Poptutors Online Assignment Inc. </div>
        </div>
      </div>
    </div>
  );
}