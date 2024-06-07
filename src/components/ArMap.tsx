import { AnimatedMarker } from "@/components/AnimatedMarker";
import { DroneIcon } from "@/components/Drone";
import React, { useState } from "react";
import { LngLat, Map, Marker } from "react-map-gl";

export const ArMap = ({ userLocation }: { userLocation: any }) => {
  const [droneStartPosition, setDroneStartPosition] = useState<LngLat | null>(
    null
  );
  const [droneEndPosition, setDroneEndPosition] = useState<LngLat | null>(null);
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_KEY}
      initialViewState={{
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 16,
      }}
      onLoad={(event) => {
        const bounds = event.target.getBounds();
        setDroneStartPosition(bounds._ne);
        setDroneEndPosition(bounds._sw);
      }}
      scrollZoom={false}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/standard"
    >
      <Marker latitude={userLocation.lat} longitude={userLocation.lng}>
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
        </span>
      </Marker>
      {droneStartPosition && (
        <AnimatedMarker
          animationDuration={20000}
          latitude={droneEndPosition?.lat!}
          longitude={droneEndPosition?.lng!}
          startingPosition={droneStartPosition}
        >
          <DroneIcon></DroneIcon>
        </AnimatedMarker>
      )}
    </Map>
  );
};
