import { Arrow } from "@/components/Compass";
import { Canvas } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import StyledButton from "@/components/buttons/StyledButton";
import { Card } from "@/components/cards/Card";
import Text from "@/components/typography/Text";
import { simpleCoord } from "@/lib/types/coordinates";
import { distance } from "@turf/turf";
import { simpleCoordToPoint } from "@/lib/mapHelpers";
import { KILOMETERS } from "@/lib/constants/unitConstant";

import Webcam from "react-webcam";
import { useCompass } from "@/hooks/useCompass";
import { useActiveFlight } from "@/hooks/useActiveFlight";
import { SkyPath, SkyRoute } from "@/components/SkyPath";
import { altitudeAlongPath, progressAlongPath } from "@/utils/skyPath";
import { DeliveryTrackerInfo } from "@/components/DeliveryTrackerInfo";
import {
  getTransfers,
  transferToTransferDetail,
} from "@/utils/transferGenerator";
import { Transition } from "@headlessui/react";

export interface simpleCoordWithHeading extends simpleCoord {
  heading?: number | null;
  altitude?: number | null;
}

export const ARTracker = () => {
  const canvasRef = useRef<any>();
  const transfer = getTransfers()[0];
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] =
    useState<simpleCoordWithHeading | null>(null);
  const { activeFlight } = useActiveFlight();
  const flightLat = activeFlight?.tracking.last_known_location.lat;
  const flightLon = activeFlight?.tracking.last_known_location.lon;
  const route = useMemo<SkyRoute | null>(() => {
    if (!activeFlight) return null;
    const { source_location, destination_location } = activeFlight;
    return {
      source: {
        name: source_location.name,
        coordinates: source_location.localisation.coordinates,
      },
      destination: {
        name: destination_location.name,
        coordinates: destination_location.localisation.coordinates,
      },
    };
  }, [activeFlight]);
  // Memoised so useCompass only recalculates when the position actually changes.
  const dronePosition = useMemo<simpleCoordWithHeading | null>(() => {
    if (!route || flightLat === undefined || flightLon === undefined) {
      return null;
    }
    const position = { lat: flightLat, lon: flightLon };
    // The API has no altitude, so take it from the drawn arc so they match.
    const altitude = altitudeAlongPath(
      progressAlongPath(
        route.source.coordinates,
        route.destination.coordinates,
        position,
      ),
    );
    return { ...position, altitude };
  }, [flightLat, flightLon, route]);
  const { rotation, isInView } = useCompass(userLocation!, dronePosition!);

  const requestPermission = () => {
    getUserLocation();
    getGyroscopePermission();
  };
  const videoConstraints = {
    facingMode: "environment",
  };

  const getGyroscopePermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      const response = await (DeviceMotionEvent as any).requestPermission();
      if (response === "granted") {
        setHasPermission(true);
        getUserLocation();
      }
    } else {
      setHasPermission(true);
      getUserLocation();
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              altitude: position.coords.altitude,
            });
          },
          (error) => {
            console.error("Error getting user's location:", error);
          },
        );
      }, 1000);
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  let isCloseToDrone = false;
  let unit = "KM";
  let distanceFromDrone =
    userLocation && dronePosition
      ? distance(
          simpleCoordToPoint(userLocation),
          simpleCoordToPoint(dronePosition),
          { units: KILOMETERS },
        )
      : 0;

  if (distanceFromDrone < 1) {
    isCloseToDrone = distanceFromDrone < 0.05;
    distanceFromDrone = distanceFromDrone * 1000;

    unit = "M";
  }
  return (
    <>
      {
        <div ref={canvasRef} className="relative h-[calc(100dvh)]" id="webcam">
          {hasPermission && (
            // Fill the screen exactly so the sky overlay lines up with the video.
            <Webcam
              videoConstraints={videoConstraints}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {hasPermission && userLocation && route && (
            <SkyPath
              userLocation={userLocation}
              route={route}
              dronePosition={dronePosition}
              droneFixTime={activeFlight?.tracking.last_polling_time}
            />
          )}
          {hasPermission && userLocation && !(isInView && isCloseToDrone) && (
            <>
              {!dronePosition && (
                <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 bg-apian-yellow p-2 rounded-md text-center">
                  <Text textSize="h2Bold">No active flights right now</Text>
                </div>
              )}
              {dronePosition && (
                <div className="absolute bottom-[100px] flex left-1/2 transform -translate-x-1/2  mt-2 flex-col">
                  <Canvas style={{ height: "50vh" }} className="h-1/2">
                    <Arrow rotation={rotation} isInView={isInView} />
                  </Canvas>
                  <div className="bg-apian-yellow p-2 rounded-md text-center">
                    <Text textSize="h2Bold">
                      Distance to drone: {distanceFromDrone.toFixed(1)} {unit}
                    </Text>
                  </div>
                  <div className="mt-2 bg-apian-yellow p-2 rounded-md text-center">
                    <Text textSize="h2Bold">
                      User altitude: {userLocation.altitude?.toFixed(1)}
                    </Text>
                  </div>
                  <div className="mt-2 bg-apian-yellow p-2 rounded-md text-center">
                    <Text textSize="h2Bold">
                      Drone altitude: {dronePosition?.altitude?.toFixed(1)}
                    </Text>
                  </div>
                </div>
              )}
            </>
          )}
          <Transition show={isInView && isCloseToDrone}>
            <div className="absolute bottom-20 md:left-20 md:right-auto left-0 right-0 w-[350px] m-auto transition duration-300 ease-in data-[closed]:translate-y-full ">
              <DeliveryTrackerInfo
                key={transfer.code}
                transfer={transferToTransferDetail(transfer) as any}
              ></DeliveryTrackerInfo>
            </div>
          </Transition>
        </div>
      }
      {!userLocation && (
        <Card className="absolute left-0 right-0 top-0 bottom-0 text-center inline-block p-4 max-w-[350px] h-[180px] m-auto">
          <Text textSize="h2">
            To use the AR tracking capabilities we need to access your location
            and camera!
          </Text>
          <StyledButton
            size="xsRoundedMd"
            className="my-4"
            onClick={requestPermission}
          >
            Give Permission
          </StyledButton>
        </Card>
      )}
    </>
  );
};

export default ARTracker;
