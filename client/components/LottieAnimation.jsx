import { useEffect, useRef, useState } from "react";

export default function LottieAnimation({ animationData, className = "" }) {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const animationRef = useRef(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !animationData || !containerRef.current || hasError) return;

    let timeoutId;
    
    const loadAnimation = async () => {
      try {
        const lottie = await import('lottie-web');
        
        if (animationRef.current) {
          animationRef.current.destroy();
        }
        
        animationRef.current = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'none'
          }
        });

                 // Style the SVG after a short delay
         timeoutId = setTimeout(() => {
           const svg = containerRef.current?.querySelector('svg');
           if (svg) {
             svg.style.width = '150%';
             svg.style.height = '100%';
             svg.setAttribute('preserveAspectRatio', 'none');
             svg.style.transform = 'translateX(-12.5%)';
             svg.style.display = 'block';
           }
         }, 200);

      } catch (error) {
        console.error('Lottie error:', error);
        setHasError(true);
      }
    };

    loadAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [isClient, animationData, hasError]);

     // Always show fallback if not client-side or error
   if (!isClient || hasError || !animationData) {
     return (
       <div 
         className={`w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60 ${className}`}
         style={{ 
           width: '150%', 
           height: '100%',
           transform: 'translateX(-12.5%)',
           display: 'block'
         }}
       />
     );
   }

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        display: 'block'
      }}
    />
  );
} 