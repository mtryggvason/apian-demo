import React, { useEffect, useState } from "react";
import ARTracker from "@/components/ARTracker";
import DesktopTracker from "@/pages/map2";
import { getTransfers } from "@/utils/transferGenerator";

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
