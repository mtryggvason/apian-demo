import { useEffect, useState } from "react";
import { LngLat, Marker, MarkerProps } from "react-map-gl";
import { bearing, point } from "@turf/turf";

import { useValueTransition } from "@/hooks/useValueTransition";

interface AnimatedMarkerProps extends MarkerProps {
  animationDuration?: number;
  startingPosition?: LngLat;
}
export const simpleCoordToPoint = ({ lat, lng }: LngLat) => point([lng, lat]);

export const AnimatedMarker = ({
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

  const lat = useValueTransition(
    initialAnimation ? startingPosition?.lat! : latitude,
    animationDuration
  );
  const lng = useValueTransition(
    initialAnimation ? startingPosition?.lng! : longitude,
    animationDuration
  );

  const rotation = bearing(
    simpleCoordToPoint({ lat, lng } as any),
    simpleCoordToPoint({ lat: latitude, lng: longitude } as any)
  );

  return (
    <Marker
      {...props}
      latitude={lat}
      longitude={lng}
      rotation={rotation !== 0 ? rotation : props.rotation}
    ></Marker>
  );
};
