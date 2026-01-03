import { useEffect } from "react";

function useScrollEnd(callback) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; 
      const windowHeight = window.innerHeight; 
      const documentHeight = document.documentElement.scrollHeight; 

      if (scrollTop + windowHeight >= documentHeight - 500) { 
        
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
}

export default useScrollEnd;
