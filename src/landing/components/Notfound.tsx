import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br text-center">
      <h1 className="text-5xl font-bold text-primary drop-shadow-md">🚧 Coming Soon</h1>
      <p className="mt-4 max-w-md text-[20px] font-semibold  text-[#464646]">
        The page is under construction.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-white transition-all hover:bg-white border border-primary  hover:text-primary"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ComingSoon;
