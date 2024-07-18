import { Card } from "@/components/cards/Card";
import droneLoadingData from "@/components/animations/drone-loading-bar.json";

import Text from "@/components/typography/Text";
import {
  getArrivalTimeAsString,
  getDepartureTimeAsString,
} from "@/lib/transferHelpers";
import { TransferDetails } from "@/lib/types/transfer";
import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import {
  getDistanceRemaining,
  getPercentageComplete,
  getTimeRemaining,
  getTransfers,
  TOTAL_DURATION,
  transferToTransferDetail,
} from "@/utils/transferGenerator";
import { Hospital } from "@/utils/hospitals";
import useSWR from "swr";

export const HospitalInfo = ({ hospital }: { hospital: Hospital }) => {
  const {
    data: transfers,
    error,
    isLoading,
  } = useSWR(
    "/api/user/123",
    () => {
      return getTransfers();
    },
    {
      refreshInterval: 15000,
    }
  );
  if (error || isLoading) {
    return null;
  }

  const arrivals = transfers?.filter(
    (transfer) => transfer.destination_location.code === hospital.code
  );
  return (
    <>
      <Card className="mb-2">
        <div className="w-[350px] p-5">
          <Text textSize="h2">{hospital.name}</Text>
          <Text textSize="body" textColor="darkGrey">
            {hospital.address}
          </Text>
        </div>
      </Card>

      <Card className="p-5 w-[350px]">
        <Text textSize="h2">Arrivals</Text>
        <div className="max-h-[200px] overflow-scroll">
          {arrivals?.map((transfer) => (
            <DeliveryTrackerInfo
              key={transfer.code}
              transfer={transferToTransferDetail(transfer) as any}
            />
          ))}
        </div>
      </Card>
    </>
  );
};

const DeliveryTrackerInfo = ({ transfer }: { transfer: TransferDetails }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const frameCount = 60;
  const fragment = getPercentageComplete(transfer);
  if (lottieRef.current) {
    const frames = lottieRef.current.getDuration(true);
    lottieRef.current.goToAndStop(fragment * frameCount, true);
  }
  return (
    <div className="w-full">
      <div className="flex row justify-between">
        <div className="flex flex-col">
          <Text textColor="darkGrey">Source</Text>
          <Text textSize="h2">{getDepartureTimeAsString(transfer)}</Text>
          <Text textColor="darkGrey">{transfer.source_location.name}</Text>
        </div>
        <div className="flex flex-col">
          <Text textColor="darkGrey">Destination</Text>
          <Text textSize="h2">{getArrivalTimeAsString(transfer)}</Text>
          <Text textColor="darkGrey">{transfer.destination_location.name}</Text>
        </div>
      </div>
      <div className="my-2">
        <Lottie
          width={"100%"}
          lottieRef={lottieRef}
          animationData={droneLoadingData}
          autoplay={false}
          loop={false}
        />
      </div>
    </div>
  );
};
