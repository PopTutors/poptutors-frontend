import { Painpoints1, Painpoints2, Painpoints3, Painpoints4, Painpoints5, Painpoints6 } from "../../assets";


const painPoints = [
  {
    caption: `Juggling part time\n job & study?`,
    imgSrc: Painpoints1,
  },
  {
    caption: `Scammed by\n Agencies?`,
    imgSrc: Painpoints2,
  },
  {
    caption: `Missing\n deadlines?`,
    imgSrc: Painpoints3,
  },
  {
    caption: `Budget\n constraints?`,
    imgSrc: Painpoints4,
  },
  {
    caption: `Low scores &\n fundamental gaps?`,
    imgSrc: Painpoints5,
  },
  {
    caption: `Lack of personalized\n teaching ?`,
    imgSrc: Painpoints6,
  },
];

export default function PainPoints() {
  return (
    <div className="my-8 px-10 text-black flex  flex-col items-center justify-center p-4 md:p-6 md:px-30">
      <div className="my-8 text-center text-3xl md:text-5xl font-bold">
        <span className="text-primary">Your Pain</span> Points
      </div>
      <div className=" grid w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {painPoints.map((point, index) => (
          <Card key={index} imgSrc={point.imgSrc} caption={point.caption} />
        ))}
      </div>
    </div>
  );
}

const Card = ({ imgSrc, caption }: { imgSrc: string; caption: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 rounded-xl p-4 md:p-6 shadow-lg bg-white w-full">
      <img
        src={imgSrc}
        alt="painpoint"
        width={120}
        height={120}
        className="h-24 w-24 md:h-auto md:w-[50%] object-contain"
      />
      <div className="w-full text-[#464646] text-lg md:text-2xl font-semibold whitespace-pre-line text-center md:text-left">
        {caption}
      </div>
    </div>
  );
};