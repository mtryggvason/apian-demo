import { useEffect, useRef, useState } from "react";
import { LngLat, Marker, MarkerProps, useMap } from "react-map-gl";
import { bearing, point } from "@turf/turf";

import { useValueTransition } from "@/hooks/useValueTransition";
import { Canvas, Coordinates } from "react-three-map";
import { useAnimations, useGLTF } from "@react-three/drei";

interface AnimatedMarkerProps extends MarkerProps {
  animationDuration?: number;
  startingPosition?: LngLat;
}
export const simpleCoordToPoint = ({ lat, lng }: LngLat) => {
  if (!lng) {
    debugger;
  }
  return point([lng, lat]);
};

export const AnimatedMarker = ({
  animationDuration = 2000,
  startingPosition,
  longitude,
  latitude,
  ...props
}: AnimatedMarkerProps) => {
  const map = useMap();
  // If there is a starting location this needs to be set to true
  const [initialAnimation, setInitialAnimation] = useState(
    (startingPosition !== undefined) as boolean
  );

  useEffect(() => {
    setInitialAnimation(false);
  }, [longitude, latitude]);

  const lat = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lat! : latitude,
    duration: animationDuration,
  });
  const lon = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lng! : longitude,
    duration: animationDuration,
  });

  const rotation =
    bearing(
      simpleCoordToPoint({ lat, lng: lon } as any),
      simpleCoordToPoint({ lat: latitude, lng: longitude } as any)
    ) - map.current!.getBearing();

  return (
    <Marker
      {...props}
      latitude={lat}
      longitude={lon}
      rotation={rotation !== 0 ? rotation : props.rotation}
    ></Marker>
  );
};

interface AnimatedMarkerProps extends MarkerProps {
  animationDuration?: number;
  startingPosition?: LngLat;
}

export const Animated3DMarker = ({
  animationDuration = 2000,
  startingPosition,
  longitude,
  latitude,
  ...props
}: AnimatedMarkerProps) => {
  // If there is a starting location this needs to be set to true
  const [initialAnimation, setInitialAnimation] = useState(
    (startingPosition !== undefined) as boolean
  );

  useEffect(() => {
    setInitialAnimation(false);
  }, [longitude, latitude]);

  const lat = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lat! : latitude,
    duration: animationDuration,
  });
  const lon = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lng! : longitude,
    duration: animationDuration,
  });

  return (
    <Coordinates altitude={100} latitude={lat} longitude={lon}>
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <SpliceElement path="/scene.gltf" />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Coordinates>
  );
};

function SpliceElement({ path }: { path: string }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);

  return <primitive scale={2} args={[10, 10, 10]} object={scene} />;
}
