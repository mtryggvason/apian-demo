import { Arrow } from "@/components/Compass";
import { DroneButton } from "@/components/icons/DroneButton";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ARView from "@/components/AR";
import { ArMap } from "@/components/ArMap";
import { DeliveryTracker } from "@/components/maps/DeliveryTracker";
import ButtonWithText from "@/components/buttons/ButtonWithText";
import StyledButton from "@/components/buttons/StyledButton";
import { Card } from "@/components/cards/Card";
import Text from "@/components/typography/Text";
import ARTracker from "@/components/ARTracker";
import DesktopTracker from "@/pages/map2";

const WebcamComponent = () => {
  const [supportsOrientation, setSupportsOrientation] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  useEffect(() => {
    if (window.DeviceOrientationEvent && "ontouchstart" in window) {
      setSupportsOrientation(true);
    }
    setDidLoad(true);
  }, []);
  if (!didLoad) return null;
  return <>{supportsOrientation ? <ARTracker /> : <DesktopTracker />}</>;
};

export default WebcamComponent;
