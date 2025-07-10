// src/components/NavbarLinks.jsx
import { Link, useLocation } from "react-router-dom";
import { paths } from "../../../config/path";
import { cn } from "../../../utils/cn";

const Links = [
  { Label: "Home", to: paths.landing.home.getHref() },
  { Label: "Assignment", to: paths.landing.assignment.getHref() },
  { Label: "Question Solving", to: paths.landing.questionSolving.getHref() },
  { Label: "Session", to: paths.landing.session.getHref() },
  { Label: "Refer & Earn", to: paths.landing.refer.getHref() },
  { Label: "Contact Us", to: paths.landing.contact.getHref() },
];

const NavbarLinks = ({ mobile = false }) => {
  const location = useLocation(); // Replaces usePathname in React

  return (
    <div
      className={cn(
        mobile
          ? "flex flex-col gap-4 items-center w-full"
          : "flex items-center justify-center gap-7 w-full"
      )}
    >
      {Links.map((link, index) => (
        <Link key={index} to={link.to} className="w-full md:w-auto">
          <div
            className={cn(
              "text-[16px]  text-bold px-1 py-1 rounded transition-colors duration-200 whitespace-nowrap",
              {
                "text-[#019ACB] font-bold bg-blue-10 ":
                  location.pathname === link.to,
                "hover:text-primary text-[#252641] font-poppinsregular": location.pathname !== link.to,
                "text-center w-full": mobile,
                "text-center": !mobile,
              }
            )}
          >
            {link.Label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NavbarLinks;
