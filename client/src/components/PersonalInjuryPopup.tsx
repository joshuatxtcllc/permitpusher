import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PersonalInjuryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Show the popup after some time on the page
  useEffect(() => {
    // Only show once per session
    if (hasShown) return;
    
    // Set a timer to show the popup after 25-35 seconds (random within that range)
    const delay = Math.floor(Math.random() * (35000 - 25000) + 25000);
    
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [hasShown]);

  // Close the popup
  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle affiliate link click
  const handleClick = () => {
    // Open affiliate link in a new tab
    window.open("https://example.com/personal-injury-affiliate", "_blank");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold mb-1">Injured in an Accident?</h3>
            <p className="text-neutral-600">Our partner attorneys can help you get the compensation you deserve.</p>
          </div>
          
          <div className="mb-4 space-y-3">
            <div className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-sm">No fee unless you win your case</p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-sm">Free case evaluation</p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-sm">Experienced attorneys in all types of injury cases</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleClick}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Get Free Legal Consultation
            </Button>
            <button
              onClick={handleClose}
              className="text-sm text-neutral-500 hover:text-neutral-700"
            >
              No thanks, maybe later
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}