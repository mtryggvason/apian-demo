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
import { Hospital } from "@/utils/hospitals";

export const HospitalInfo = ({ hospital }: { hospital: Hospital }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <Card>
      <div className="w-[350px] p-5">
        <Text textSize="h2">{hospital.name}</Text>
        <Text textSize="body" textColor="darkGrey">
          {hospital.address}
        </Text>
      </div>
    </Card>
  );
};
