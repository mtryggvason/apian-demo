import { useEffect, useState } from "react";
import { Marker, MarkerProps } from "react-map-gl";
import { bearing } from "@turf/turf";

import { useValueTransition } from "@/hooks/useValueTransition";
import { simpleCoordToPoint } from "@/lib/mapHelpers";
import { simpleCoord } from "@/lib/types/coordinates";

interface AnimatedMarkerProps extends MarkerProps {
  animationDuration?: number;
  startingPosition?: simpleCoord;
}

export const AnimatedMarker = ({
  animationDuration = 2000,
  startingPosition,
  longitude,
  latitude,
  ...props
}: AnimatedMarkerProps) => {
  // If there is a starting location this needs to be set to true
  const [initialAnimation, setInitialAnimation] = useState(
    (startingPosition !== undefined) as boolean,
  );

  useEffect(() => {
    setInitialAnimation(false);
  }, [longitude, latitude]);

  const lat = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lat! : latitude,
    duration: animationDuration,
  });
  const lon = useValueTransition({
    inputValue: initialAnimation ? startingPosition?.lon! : longitude,
    duration: animationDuration,
  });

  const rotation = bearing(
    simpleCoordToPoint({ lat, lon }),
    simpleCoordToPoint({ lat: latitude, lon: longitude }),
  );

  return (
    <Marker
      {...props}
      latitude={lat}
      longitude={lon}
      rotation={rotation !== 0 ? rotation : props.rotation}
    ></Marker>
  );
};
