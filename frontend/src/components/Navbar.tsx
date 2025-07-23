import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Toggle small shadow after scrolling a bit
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Animated underline utility classes for desktop
  const linkClasses =
    "relative text-navbar-text transition hover:text-brand-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-brand-primary after:w-0 hover:after:w-full after:transition-all after:duration-300";

  return (
    <nav className={`backdrop-blur-md bg-soft-off-white/80 border-b border-[#e0e0e0] sticky top-0 z-50 py-3 transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl px-4 mx-auto flex justify-between items-center">
        {/* Left placeholder for balancing layout */}
        <div className="w-10"></div>

        {/* Desktop Navigation Links - Centered */} 
        <div className="hidden md:flex space-x-8 items-center mx-auto">
          <Link to="/" className={linkClasses}>Home</Link>
          <Link to="/about" className={linkClasses}>About Us</Link>
          <Link to="/services" className={linkClasses}>Services</Link>
          <Link to="/projects" className={linkClasses}>Projects</Link>
          <Link to="/ideas" className={linkClasses}>Ideas</Link>
        </div>

        {/* Desktop Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="hidden md:block flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-700 rounded-2xl hover:bg-red-600/20 transition-all duration-200 shadow-sm mr-6">
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="hidden md:block flex items-center gap-2 px-4 py-2 bg-[#FFB300]/10 text-[#B36B00] rounded-2xl hover:bg-[#FFB300]/20 transition-all duration-200 shadow-sm mr-6">
            Login
          </button>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-navbar-text focus:outline-none">
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-soft-off-white mt-2 shadow-lg rounded-lg">
          <div className="flex flex-col items-center py-4 space-y-4">
            {/* Mobile Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="bg-red-500/10 text-red-700 px-5 py-2 rounded-2xl font-medium hover:bg-red-600/20 transition-all duration-200 w-3/4 shadow-sm">
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLoginClick();
                }}
                className="bg-[#FFB300]/10 text-[#B36B00] px-5 py-2 rounded-2xl font-medium hover:bg-[#FFB300]/20 transition-all duration-200 w-3/4 shadow-sm">
                Login
              </button>
            )}
            <Link to="/" className={linkClasses}>Home</Link>
            <Link to="/about" className={linkClasses}>About Us</Link>
            <Link to="/services" className={linkClasses}>Services</Link>
            <Link to="/projects" className={linkClasses}>Projects</Link>
            <Link to="/ideas" className={linkClasses}>Ideas</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 