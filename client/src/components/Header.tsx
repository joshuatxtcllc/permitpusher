import { useState } from "react";
import { scrollToElement } from "@/lib/utils";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (id: string) => {
    scrollToElement(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold text-primary font-heading">
                City Permit <span className="text-neutral-800">RUSH</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <button
              onClick={() => handleNavClick("services")}
              className="text-neutral-700 hover:text-primary transition"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-neutral-700 hover:text-primary transition"
            >
              How It Works
            </button>

            <button
              onClick={() => handleNavClick("testimonials")}
              className="text-neutral-700 hover:text-primary transition"
            >
              Success Stories
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="text-neutral-700 hover:text-primary transition"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick("contact")}
              className="bg-secondary hover:bg-secondary/80 text-white font-medium py-2 px-6 rounded-md transition duration-300 shadow-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="text-neutral-500 hover:text-primary focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white pb-4 px-4 border-t border-neutral-200`}
      >
        <div className="flex flex-col space-y-3 pt-2 pb-3">
          <button
            onClick={() => handleNavClick("services")}
            className="text-neutral-700 hover:text-primary transition py-2 px-3 font-medium text-left"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick("how-it-works")}
            className="text-neutral-700 hover:text-primary transition py-2 px-3 font-medium text-left"
          >
            How It Works
          </button>

          <button
            onClick={() => handleNavClick("testimonials")}
            className="text-neutral-700 hover:text-primary transition py-2 px-3 font-medium text-left"
          >
            Success Stories
          </button>
          <button
            onClick={() => handleNavClick("faq")}
            className="text-neutral-700 hover:text-primary transition py-2 px-3 font-medium text-left"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className="bg-secondary hover:bg-secondary/80 text-white font-medium py-2 px-3 rounded-md transition duration-300 text-center"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}