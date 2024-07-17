import { useRef } from "react";
import { Map, MapRef, Marker } from "react-map-gl";

import FlightRoute from "@/components/maps/FlightRoute";
import { calculateRouteInitialViewStateByBounds } from "@/lib/mapHelpers";
import { simpleCoord } from "@/lib/types/coordinates";

export default function FlightMap({
  startLocation,
  endLocation,
}: {
  startLocation: simpleCoord;
  endLocation: simpleCoord;
}) {
  const mapRef = useRef<MapRef>(null);
  const initialViewState = calculateRouteInitialViewStateByBounds(
    startLocation,
    endLocation,
  );

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      mapStyle={process.env.NEXT_PUBLIC_MAPBOX_THEME}
      attributionControl={false}
      dragPan={true}
      scrollZoom={true}
    >
      <Marker
        longitude={startLocation.lon}
        latitude={startLocation.lat}
        anchor="center"
        color={"red"}
      />
      <Marker
        longitude={endLocation.lon}
        latitude={endLocation.lat}
        anchor="center"
        color={"red"}
      />
      <FlightRoute startLocation={startLocation} endLocation={endLocation} />
    </Map>
  );
}
