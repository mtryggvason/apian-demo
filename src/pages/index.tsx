import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DesktopTracker from "@/pages/map2";
import { getTransfers } from "@/utils/transferGenerator";

// Browser-only: camera, compass, GPS, and lottie-web (which crashes on the server).
const ARTracker = dynamic(() => import("@/components/ARTracker"), {
  ssr: false,
});

const WebcamComponent = () => {
  const [supportsOrientation, setSupportsOrientation] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    getTransfers();
    if (window.DeviceOrientationEvent && "ontouchstart" in window) {
      setSupportsOrientation(true);
    }
    setDidLoad(true);
  }, []);
  if (!didLoad) return null;
  return <ARTracker />;
};

export default WebcamComponent;
