import { useEffect, useState } from "react";
import { LngLatBounds, useMap } from "react-map-gl";

import { Drone } from "@/components/icons/Drone";
import useSWR from "swr";
import { getTrackings, updateTrackings } from "@/utils/transferGenerator";
import { TransferTrackingResponse } from "@/lib/types/transfer";
import { Animated3DMarker, AnimatedMarker } from "@/components/AnimatedMarker";
import { useQueryState } from "nuqs";
import { Canvas } from "react-three-map";

interface NearbyTransfersProps {
  ignoreTransfers?: string[];
}

export const NearbyTransfers = ({
  ignoreTransfers = [],
}: NearbyTransfersProps) => {
  const [code, setCode] = useQueryState("code");
  const map = useMap();
  /*
  const [boundingBox, setBoundingBox] = useState<LngLatBounds>();

  useEffect(() => {
    map.current?.on("moveend", () => {
      const bb = map.current?.getBounds();
      setBoundingBox(bb);
    });
    const bb = map.current?.getBounds();
    setBoundingBox(bb);
  }, [map]);
  */

  const { data: data } = useSWR(
    "nearbytrackings",
    () => {
      return getTrackings();
    },
    {
      refreshInterval: 5000,
    }
  );

  const results = data ?? [];
  const transfers = results
    .filter(
      (transfer: TransferTrackingResponse) =>
        !ignoreTransfers.includes(transfer.code)
    )
    .filter(
      (nearbyTransfer: TransferTrackingResponse) =>
        nearbyTransfer.tracking?.current_position.lat &&
        nearbyTransfer.tracking?.current_position.lon
    )
    .map((nearbyTransfer: TransferTrackingResponse) => {
      const previousPosition =
        nearbyTransfer.tracking?.flight_path_coordinates.at(-2);
      return (
        <AnimatedMarker
          startingPosition={
            previousPosition
              ? ({
                  lat: previousPosition[1],
                  lng: previousPosition[0],
                } as any)
              : undefined
          }
          key={nearbyTransfer.code}
          latitude={nearbyTransfer.tracking!.current_position.lat}
          longitude={nearbyTransfer.tracking!.current_position.lon}
          animationDuration={7000}
        >
          <span
            onClick={(event) => {
              event.stopPropagation();
              setCode(nearbyTransfer.code);
            }}
          >
            <Drone className="h-[30px] w-[30px]" />
          </span>
        </AnimatedMarker>
      );
    });

  return <>{transfers}</>;
};
