import { Layer, Source } from "react-map-gl";
import { lineString } from "@turf/turf";

import { simpleCoord } from "@/lib/types/coordinates";

export default function FlightRoute({
  startLocation,
  endLocation,
}: {
  startLocation: simpleCoord;
  endLocation: simpleCoord;
}) {
  // This component shows a line between start and end location
  // that can represent a departure and arrival locations or
  // a departure and current drone position
  // but this can be improved by customizing how this line is rendered
  // depending on properties of the flight
  // ie: if the flight is finished or still in progress
  //  It can also be extended to receive a list of positions
  // and draw a line between those positions in case the flight
  // is not just from position A to B

  const routeData: [number, number][] = [
    [startLocation.lon, startLocation.lat],
    [endLocation.lon, endLocation.lat],
  ];

  const layerId: string = "flightRoute";
  const route = lineString(routeData);
  return (
    <>
      <Source id={layerId} type="geojson" data={route}>
        <Layer
          id={layerId}
          type={"line"}
          source={"route"}
          paint={{
            "line-color": "#f00",
            "line-width": 2,
            "line-opacity": 1,
          }}
        />
      </Source>
    </>
  );
}
