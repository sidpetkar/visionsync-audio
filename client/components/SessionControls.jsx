import { useState, useEffect } from "react";
import { Square } from "react-feather";

export default function SessionControls({
  startSession,
  stopSession,
  isSessionActive,
}) {
  const [isActivating, setIsActivating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showActiveState, setShowActiveState] = useState(false);

  // Handle transition when session becomes active
  useEffect(() => {
    if (isSessionActive && !showActiveState) {
      // Start transition immediately when session becomes active
      setIsTransitioning(true);
      // After fade out completes, switch to active state and fade in
      setTimeout(() => {
        setShowActiveState(true);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 1000);
    } else if (!isSessionActive && showActiveState) {
      // Handle transition back to default state
      setIsTransitioning(true);
      setTimeout(() => {
        setShowActiveState(false);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 1000);
    }
  }, [isSessionActive, showActiveState]);

  async function handleStartSession() {
    if (isActivating) return;
    setIsActivating(true);
    try {
      await startSession();
    } catch (error) {
      console.error("Start session error:", error);
    }
    setIsActivating(false);
  }

  function handleStopSession() {
    setIsTransitioning(true);
    stopSession();
    // Add a small delay for smooth transition
    setTimeout(() => setIsTransitioning(false), 500);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 relative z-10">
      {!showActiveState ? (
        // Default state content
        <div 
          className={`flex flex-col items-center transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="text-center space-y-6 mb-16">
            <h1 
              className="font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent" 
              style={{ fontSize: '32px' }}
            >
              VisionSync 2
            </h1>
            <p className="text-white/80 font-light max-w-sm mx-auto" style={{ fontSize: '18px' }}>
              Your personal voice assistant powered by<br />GPT Realtime
            </p>
          </div>
          
          <button
            onClick={handleStartSession}
            disabled={isActivating}
            className="
              px-8 py-4 bg-white/20 hover:bg-white/30 active:bg-white/40
              text-white font-semibold rounded-full
              transition-all duration-300 transform hover:scale-105 active:scale-95
              backdrop-blur-sm border border-white/30
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isActivating ? "Starting..." : "Start Experience"}
          </button>
        </div>
      ) : (
        // Active state content
        <div 
          className={`flex flex-col items-center space-y-4 transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <button
            onClick={handleStopSession}
            className="
              w-16 h-16 rounded-full flex items-center justify-center
              bg-white/20 hover:bg-white/30 active:bg-white/40
              transition-all duration-300 transform hover:scale-105 active:scale-95
              backdrop-blur-sm border border-white/30
            "
          >
            <Square size={24} color="white" fill="white" />
          </button>
          
          <p className="text-white/60 text-sm">End</p>
        </div>
      )}
    </div>
  );
}
