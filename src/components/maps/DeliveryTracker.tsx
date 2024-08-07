import { useQueryState } from "nuqs";

import {
  getTrackings,
  getTransfers,
  transferToTransferDetail,
  updateTrackings,
} from "@/utils/transferGenerator";
import { useEffect, useState } from "react";
import useSWR from "swr";
import TransferTrackingMap from "@/components/maps/TransferTrackingMap";
import { useInterval } from "usehooks-ts";
import { NearbyTransfers } from "@/components/maps/NearbyTransfers";
import { simpleCoordToBoundingBox } from "@/lib/mapHelpers";
import { DeliveryTrackerInfo } from "@/components/DeliveryTrackerInfo";
import { TransferDetails } from "@/lib/types/transfer";
import { hospitals } from "@/utils/hospitals";
import { Marker } from "react-map-gl";
import { NHS } from "@/components/icons/NHS";
import { HospitalInfo } from "@/components/HospitalInfo";

export function DeliveryTracker({}) {
  const [code, setCode] = useQueryState("code");
  const [hospitalCode, setHospitalCode] = useQueryState("hospital-code");

  useEffect(() => {
    if (code) {
      setHospitalCode(null);
    }
  }, [code, setHospitalCode]);
  const [render, setRender] = useState(false);
  useInterval(() => {
    setRender((r) => !r);
  }, 1000);
  const { data: transfers, isLoading } = useSWR(
    "transfers",
    () => {
      return getTransfers();
    },
    {
      refreshInterval: 5000,
    }
  );

  const key = transfers ? "trackings" : null;
  const { data: trackings } = useSWR(
    key,
    () => {
      updateTrackings();
      return Promise.resolve(getTrackings());
    },
    {
      refreshInterval: 5000,
    }
  );

  if (!transfers || !trackings) return null;

  const transfer = code
    ? transfers?.find((transfer) => transfer.code === code)
    : undefined;
  const tracking = transfer
    ? trackings?.find((tr) => tr.code === transfer.code)
    : undefined;

  const points = trackings
    ? trackings?.map((tr) => tr.tracking?.current_position)
    : undefined;
  const bounds = trackings
    ? simpleCoordToBoundingBox(points as any)
    : undefined;
  const hospitalMarkers = hospitals.map((hospital) => (
    <Marker
      onClick={() => {
        setCode(null);
        setHospitalCode(hospital.code);
      }}
      key={hospital.code}
      anchor="bottom"
      style={{ top: "2px" }}
      latitude={hospital.coordinates.lat!}
      longitude={hospital.coordinates.lon!}
    >
      <NHS />
    </Marker>
  ));

  const hospital = hospitals.find((hos) => hos.code === hospitalCode);
  return (
    <div className="h-screen w-screen">
      <TransferTrackingMap
        is3D={false}
        initialViewState={
          {
            bounds: bounds as any,
            fitBoundsOptions: {
              padding: 60,
            },
          } as any
        }
        transfer={transfer as any}
        transferTracking={tracking}
      >
        <NearbyTransfers
          ignoreTransfers={transfer ? [transfer.code] : undefined}
        ></NearbyTransfers>
        {hospitalMarkers}
      </TransferTrackingMap>
      {transfer && (
        <div className="absolute bottom-20 md:left-20 md:right-auto left-0 right-0 w-[350px] m-auto ">
          <DeliveryTrackerInfo
            key={transfer.code}
            transfer={transferToTransferDetail(transfer) as any}
          ></DeliveryTrackerInfo>
        </div>
      )}

      {hospital && (
        <div className="absolute bottom-20 md:left-20 md:right-auto left-0 right-0 w-[350px] m-auto ">
          <HospitalInfo key={hospital.code} hospital={hospital}></HospitalInfo>
        </div>
      )}
    </div>
  );
}
