import { CheckIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../../components/ui/button";


const Features = ({
  direction = "left",
  steps,
  imageSrc,
  titleOne,
  titleTwo,
  caption,
}: {
  direction?: "left" | "right";
  steps: {
    step: string;
  }[];
  imageSrc: string;
  titleOne: string;
  titleTwo: string;
  caption: string;
}) => {
  return (
    <div
      className={cn(
        "my-4 md:my-16 flex flex-col-reverse md:flex-row w-full items-center justify-around gap-1 md:gap-10 p-4 md:p-6 md:px-24",
        {
          "md:flex-row-reverse": direction === "right",
        }
      )}
    >
      <div className="flex w-full md:w-max flex-col items-start gap-4">
        <div className="text-[38px] md:text-5xl font-semibold">
          <span className="text-primary">{titleOne}</span> <span className="text-black">{titleTwo}</span>
        </div>
        <div className="w-full md:w-fit text-[22px] md:text-xl font-semibold whitespace-pre-line text-[#464646]">
          {caption}
        </div>
        <div className="relative flex flex-col justify-center gap-4 md:gap-8 text-base md:text-xl text-gray-600">
          {steps.map((item, index) => (
            <div key={index} className="flex items-center gap-3 md:gap-4">
              <div className="bg-primary flex h-5 w-5 z-[1] items-center justify-center rounded-full text-white">
                <CheckIcon className="w-5 font-bold p-1" strokeWidth={2} />
              </div>
              {item.step.includes("We") ? (
                <span>
                  {item.step.split(" ").map((word) => {
                    if (word.toLowerCase() === "we") {
                      return (
                        <span key={word} className="text-primary font-bold">
                          {word}{" "}
                        </span>
                      );
                    }
                    return <span key={word}>{word} </span>;
                  })}
                </span>
              ) : (
                <span>{item.step}</span>
              )}
            </div>
          ))}
          <div className="bg-primary absolute left-0 -z-[0] h-[95%] w-[2px] translate-x-2"></div>
        </div>
        <a href={`/not-found`} className="w-fit">
          <Button
            variant={"outline"}
            className="border-primary text-primary mt-6 md:mt-8 h-10 w-32 md:w-40 rounded-full border-2 text-base md:text-lg font-semibold"
          >
            Get Started
          </Button>
        </a>
      </div>
      <div className="hidden md:block md:w-auto">
        <img
          src={imageSrc}
          alt="Assignment Support"
          width={500}
          height={500}
          className="h-auto md:w-[500px] md:h-[500px] object-contain"
        />
      </div>
    </div>
  );
};

export default Features;