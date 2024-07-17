"use client";

import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { LngLatBoundsLike, MapRef, Marker, ScaleControl } from "react-map-gl";
import { FitBoundsOptions } from "mapbox-gl";
import { useWindowSize } from "usehooks-ts";

import { MapDestination } from "@/components/icons/MapDestination";
import { ApianMap } from "@/components/maps/ApianMap";
import DroneWithPaths from "@/components/maps/DroneWithPaths";
import { ApianTransferStatusCodes } from "@/lib/constants/apianTransferStatuses";
import { simpleCoordToBoundingBox } from "@/lib/mapHelpers";
import {
  TransferDetails,
  TransferTrackingResponse,
} from "@/lib/types/transfer";
import { useQueryState } from "nuqs";

interface TransferTrackingProps {
  is3D: boolean;
  transfer?: TransferDetails;
  transferTracking?: TransferTrackingResponse;
  children?: ReactNode;
  initialViewState?: {
    bounds: LngLatBoundsLike;
    fitBoundsOptions: FitBoundsOptions;
  };
  fitBoundsOptions?: FitBoundsOptions;
  scaleMargin?: "15px" | "48px";
}

const SMALL_SCREEN_PADDING = 80;

export default function TransferTrackingMap({
  transfer,
  transferTracking,
  fitBoundsOptions,
  children,
  is3D,
  scaleMargin = "15px",
  initialViewState,
}: TransferTrackingProps) {
  const mapRef = useRef<MapRef>(null);
  const bounds = useMemo(() => {
    if (!transfer) return undefined;
    return transfer
      ? simpleCoordToBoundingBox([
          transfer.source_location.coordinates,
          transfer.destination_location.coordinates,
          ...(transferTracking?.tracking?.current_position
            ? [transferTracking?.tracking?.current_position]
            : []),
        ])
      : {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfer?.code]);
  const [, setCode] = useQueryState("code");

  const boundsOptions = fitBoundsOptions ?? {
    padding: {
      left: SMALL_SCREEN_PADDING,
      right: SMALL_SCREEN_PADDING,
      top: 60, // to account for the height of the location marker
      bottom: 60, // less margin on bottom as marker grows upwards
    },
  };
  useEffect(() => {
    if (bounds && bounds.hasOwnProperty(0)) {
      mapRef.current?.fitBounds(bounds as LngLatBoundsLike, boundsOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);
  const startLocation = transfer?.source_location.coordinates;
  const endLocation = transfer?.destination_location.coordinates;

  const initalViewStateFallback = initialViewState ?? {
    bounds: bounds as LngLatBoundsLike,
    fitBoundsOptions: boundsOptions,
  };

  // Assuming that the last position is the same as current position we make the drone start from its the second last position
  // This causes the drone to be animating when the page is loaded.
  const lastDronePosition =
    transferTracking?.tracking?.flight_path_coordinates?.at(-2);

  const inFlight =
    transferTracking?.status ==
    ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION;

  const transferComplete =
    transferTracking?.status == ApianTransferStatusCodes.TRANSFER_COMPLETED;
  return (
    <>
      <ApianMap
        showControls={true}
        ref={mapRef}
        onClick={() => setCode(null)}
        initialViewState={initalViewStateFallback}
        attributionControl={false}
        dragPan={true}
        scrollZoom={true}
        dragRotate={true}
        controlsClassName={`absolute z-10 space-y-[15px] ${
          scaleMargin === "15px"
            ? "bottom-[15px] right-[15px]"
            : "bottom-[10px] right-[10px] sm:bottom-[56px] sm:right-[56px]"
        }`}
      >
        <ScaleControl
          data-testid="scale"
          position="top-left"
          style={{ margin: scaleMargin }}
        />

        {transferTracking && transfer && (
          <DroneWithPaths
            is3D={is3D}
            key={transfer.code}
            showDrone={inFlight}
            routeStartPoint={startLocation!}
            routeEndPoint={endLocation!}
            isComplete={transferComplete}
            animatingFromPosition={
              lastDronePosition
                ? { lat: lastDronePosition[1], lon: lastDronePosition[0] }
                : undefined
            }
            tracking={transferTracking.tracking}
          />
        )}
        {children}
      </ApianMap>
    </>
  );
}
