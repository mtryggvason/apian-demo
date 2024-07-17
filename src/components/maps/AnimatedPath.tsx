import { ReactNode, useEffect, useState } from "react";
import { Source } from "react-map-gl";
import { lineString } from "@turf/turf";

import { useValueTransition } from "@/hooks/useValueTransition";
import { simpleCoordToArray } from "@/lib/mapHelpers";
import { simpleCoord } from "@/lib/types/coordinates";

interface AnimatedPathProps {
  animationDuration?: number;
  startingPosition: simpleCoord;
  endPosition: simpleCoord;
  children: ReactNode;
}
/**
 * AnimatedPath component that animates the transition of a geographical path
 * from a starting position to an end position over a specified duration.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.animationDuration=2000] - The duration of the animation in milliseconds.
 * @param {Object} props.startingPosition - The starting geographical position with `lat` and `lon` properties.
 * @param {Object} props.endPosition - The ending geographical position with `lat` and `lon` properties.
 * @param {ReactNode} props.children - The children components to be rendered within the `Source` component.
 *
 * @returns {JSX.Element} A `Source` component with animated path data.
 */
export const AnimatedPath = ({
  animationDuration = 2000,
  startingPosition,
  endPosition,
  children,
}: AnimatedPathProps) => {
  // If there is a starting location this needs to be set to true
  const [position, setPosition] = useState(startingPosition);
  useEffect(() => {
    setPosition(endPosition);
  }, [endPosition]);

  const lat = useValueTransition({
    inputValue: position.lat,
    duration: animationDuration,
  });
  const lon = useValueTransition({
    inputValue: position.lon,
    duration: animationDuration,
  });

  const path = lineString([
    simpleCoordToArray(startingPosition),
    simpleCoordToArray({ lat, lon }),
  ]);

  return (
    <Source type="geojson" data={path}>
      {children}
    </Source>
  );
};
