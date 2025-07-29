import { logo, WalletIcon } from '../../../assets';
import { Button } from '../../../components/ui/button';
import NavbarLinks from './NavbarLinks';
import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-accent  flex items-center justify-between p-4 md:p-6 md:px-26 relative">
      <div className="flex items-center">
        <img src={logo} width={160} height={40} alt="logo-image" className="w-32 md:w-42" />
      </div>

      {/* Hamburger/Close Button for Mobile */}
      <button
        className="md:hidden ml-auto z-30"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        <NavbarLinks />
        <img src={WalletIcon} width={40} height={40} alt="wallet-icon" className="w-6" />
        <a href="/not-found">
          <Button className="border-primary text-primary rounded-full border-2 bg-white px-6 font-semibold hover:bg-primary hover:text-white">
            Login
          </Button>
        </a>
        <a href="/not-found">
          <Button className="border-primary rounded-full border-2 px-6 font-semibold text-white">
            Sign Up
          </Button>
        </a>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-full bg-accent z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6 p-6">
          <NavbarLinks mobile />
          <div className="flex flex-col gap-2">
            <img
              src="landing/student/wallet-icon.svg"
              width={32}
              height={32}
              alt="wallet-icon"
              className="w-6 mx-auto"
            />
            <a href="/not-found">
              <Button className="border-primary text-primary rounded-full border-2 bg-white w-full font-semibold  hover:text-white">
                Login
              </Button>
            </a>
            <a href="/not-found">
              <Button className="border-primary rounded-full border-2 w-full font-semibold text-white">
                Sign Up
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay background */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
