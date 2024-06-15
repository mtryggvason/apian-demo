import React, { useState, useEffect } from "react";
import { Text, Box } from "@react-three/drei";

import dynamic from "next/dynamic";

const ARCanvas = dynamic(
  () => {
    return import("@artcom/react-three-arjs").then((mod) => mod.ARCanvas);
  },
  { ssr: false, loading: () => <p>Loading...</p> }
);

const ARMarker = dynamic(
  () => {
    return import("@artcom/react-three-arjs").then((mod) => mod.ARMarker);
  },
  { ssr: false, loading: () => null }
);

const CountdownTimer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format the time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <Text
        position={[0, 0, 0.1]} // Slightly in front of the frame
        fontSize={1} // Increase the font size
        color="black"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]} // Rotate text 90 degrees up/down
      >
        {formatTime(timeLeft)}
      </Text>
    </>
  );
};

const ARView = () => {
  return (
    <ARCanvas
      onCameraStreamReady={() => console.log("Camera stream ready")}
      onCameraStreamError={() => console.error("Camera stream error")}
      sourceType={"webcam"}
    >
      <ambientLight />
      <pointLight position={[10, 10, 0]} intensity={10.0} />
      <ARMarker
        debug={true}
        params={{ smooth: true }}
        type={"pattern"}
        patternUrl={"data/patt.hiro"}
        onMarkerFound={() => {
          console.log("Marker Found");
        }}
      >
        <CountdownTimer duration={70} />
      </ARMarker>
    </ARCanvas>
  );
};

export default ARView;
