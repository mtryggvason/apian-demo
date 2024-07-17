import React, { useRef, useEffect, useState, ReactNode } from "react";

export const ScaleToFitWidth = ({ children }: { children: ReactNode }) => {
  const elementRef = useRef<any>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current) {
        const elementWidth = elementRef.current.offsetWidth;
        const viewportWidth = document.body.clientWidth - 32;
        const newScaleFactor = viewportWidth / elementWidth;
        setScaleFactor(newScaleFactor);
      }
    };

    // Initial scaling
    handleResize();

    // Resize scaling
    //window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="inline-block"
      ref={elementRef}
      style={{
        transformOrigin: "top left",
        transform: `scale(${scaleFactor})`,
      }}
    >
      {children}
    </div>
  );
};
