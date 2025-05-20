import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TrialExpirationModalProps {
  trialDays?: number; // Make trial duration configurable
  onUpgrade?: () => void; // Function to call when upgrade button is clicked
  onClose?: () => void; // Function to call when modal is closed
  delayMs?: number; // Delay before showing the modal in milliseconds
}

const TrialExpirationModal = ({
  trialDays = 15, // Default to 15 days if not specified
  onUpgrade = () => window.location.href = "/payment",
  onClose = () => {},
  delayMs = 2000, // Default 2 second delay
}: TrialExpirationModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to show the modal after the specified delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-md transform rounded-lg bg-gray-900 border border-purple-500/50 shadow-xl transition-all"
        style={{
          animation: "modal-appear 0.3s ease-out forwards"
        }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="text-lg font-medium text-purple-400">Trial Expired</h3>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-900/50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-medium text-white mb-2">Your {trialDays}-day trial has ended</h4>
            <p className="text-gray-400">
              Upgrade now to continue accessing all premium features
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setIsVisible(false);
                onUpgrade();
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors w-full flex items-center justify-center"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 py-2 px-4 rounded-md font-medium transition-colors w-full"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TrialExpirationModal;