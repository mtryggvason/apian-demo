"use client";
import React, { useRef } from "react";
import { MapRef, Marker, ViewState } from "react-map-gl";

import { MapDestination } from "@/components/icons/MapDestination";
import { ApianMap, ApianMapProps } from "@/components/maps/ApianMap";
import { simpleCoord } from "@/lib/types/coordinates";

interface LocationMapProps extends ApianMapProps {
  coordinates: simpleCoord;
  initialViewState?: Partial<ViewState>;
  pinWidth?: number;
  pinHeight?: number;
}

export default function LocationMap({
  coordinates,
  initialViewState,
  pinWidth = 38,
  pinHeight = 48,
  ...mapProps
}: LocationMapProps) {
  const mapRef = useRef<MapRef>(null);
  return (
    <ApianMap
      ref={mapRef}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      {...mapProps}
    >
      <Marker
        longitude={coordinates.lon}
        latitude={coordinates.lat}
        anchor="center"
      >
        <MapDestination width={pinWidth} height={pinHeight} />
      </Marker>
    </ApianMap>
  );
}
