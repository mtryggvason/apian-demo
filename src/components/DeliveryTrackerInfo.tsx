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
  TOTAL_DURATION,
} from "@/utils/transferGenerator";

export const DeliveryTrackerInfo = ({
  transfer,
}: {
  transfer: TransferDetails;
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const frameCount = 60;
  const fragment = getPercentageComplete(transfer);
  if (lottieRef.current) {
    const frames = lottieRef.current.getDuration(true);
    lottieRef.current.goToAndStop(fragment * frameCount, true);
  }
  return (
    <Card>
      <div className="w-[350px] p-5">
        <div className="flex row justify-between">
          <div className="flex flex-col">
            <Text textColor="darkGrey">Source</Text>
            <Text textSize="h2">{getDepartureTimeAsString(transfer)}</Text>
            <Text textColor="darkGrey">{transfer.source_location.name}</Text>
          </div>
          <div className="flex flex-col">
            <Text textColor="darkGrey">Destination</Text>
            <Text textSize="h2">{getArrivalTimeAsString(transfer)}</Text>
            <Text textColor="darkGrey">
              {transfer.destination_location.name}
            </Text>
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
        <div className="my-2 flex justify-between w-full ">
          <Text>Time Remaining:</Text>
          <Text>{getTimeRemaining(transfer)} min</Text>
        </div>
        <div className="my-2 flex justify-between w-full ">
          <Text>Distance Remaining:</Text>
          <Text>{getDistanceRemaining(transfer).toFixed(2)}</Text>
        </div>
        <div className="my-2 flex justify-between w-full ">
          <Text>Current Speed:</Text>
          <Text>25mph</Text>
        </div>
      </div>
    </Card>
  );
};
