import { Arrow } from "@/components/Compass";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import StyledButton from "@/components/buttons/StyledButton";
import { Card } from "@/components/cards/Card";
import Text from "@/components/typography/Text";
import { simpleCoord } from "@/lib/types/coordinates";
import { distance } from "@turf/turf";
import { simpleCoordToPoint } from "@/lib/mapHelpers";
import { KILOMETERS } from "@/lib/constants/unitConstant";
import { useDebounceCallback } from "usehooks-ts";
import { ApianMap } from "@/components/maps/ApianMap";
import { Marker } from "react-map-gl";
import { ArrowMarker } from "@/components/icons/ArrowMarker";
import { Drone } from "@/components/icons/Drone";
import { MapIcon } from "@/components/icons/MapIcon";
import SlidePanel from "@/components/popovers/SlidePanel";

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
  const mapRef = useRef<any>();
  const transfer = getTransfers()[0];
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] =
    useState<simpleCoordWithHeading | null>(null);
  const [heading, setHeading] = useState(0);
  const [beta, setBeta] = useState(0);
  const { activeFlight } = useActiveFlight();
  // The flights API has no altitude, so it's set by hand in the map panel.
  const [droneAltitude, setDroneAltitude] = useState(10);
  // Debug override: tapping the map pins the drone to that spot.
  const [manualDronePosition, setManualDronePosition] =
    useState<simpleCoord | null>(null);
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
    if (manualDronePosition) {
      return { ...manualDronePosition, altitude: droneAltitude };
    }
    if (flightLat === undefined || flightLon === undefined) return null;
    const position = { lat: flightLat, lon: flightLon };
    // On a known route, take the altitude from the drawn arc so they match.
    const altitude = route
      ? altitudeAlongPath(
          progressAlongPath(
            route.source.coordinates,
            route.destination.coordinates,
            position,
          ),
        )
      : droneAltitude;
    return { ...position, altitude };
  }, [manualDronePosition, flightLat, flightLon, droneAltitude, route]);
  const [showMap, setShowMap] = useState(false);
  const { rotation, isInView } = useCompass(userLocation!, dronePosition!);

  const requestPermission = () => {
    getUserLocation();
    getGyroscopePermission();
  };
  const videoConstraints = {
    facingMode: "environment",
  };

  const handleOrientation = useDebounceCallback((event) => {
    let compassdir;
    const { beta } = event;
    let normalizedBeta = beta < 0 ? 360 + beta : beta;
    normalizedBeta = Math.min(normalizedBeta, 360);
    setBeta(normalizedBeta);
    if (event.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      compassdir = event.webkitCompassHeading;
    } else compassdir = event.alpha;
    setHeading(Math.floor(compassdir));
  }, 100);

  useEffect(() => {
    if (hasPermission) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [hasPermission, handleOrientation]);

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
            />
          )}
          {hasPermission && userLocation && !(isInView && isCloseToDrone) && (
            <>
              <div className="absolute top-[25px] right-[25px]">
                <StyledButton
                  onClick={() => setShowMap(true)}
                  size="mdRoundedMdSquare"
                >
                  <MapIcon className="w-[30px] h-auto"></MapIcon>
                </StyledButton>
              </div>
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
      <SlidePanel
        isOpen={showMap}
        onClose={() => {
          setShowMap(false);
        }}
      >
        <div className="h-screen w-screen">
          <input
            type="number"
            onChange={(event) => {
              const altitude = parseInt(event.target.value);
              setDroneAltitude(Number.isNaN(altitude) ? 0 : altitude);
            }}
            value={droneAltitude}
          ></input>
          {manualDronePosition && (
            <button
              className="ml-2 underline"
              onClick={() => setManualDronePosition(null)}
            >
              Use live flight position
            </button>
          )}
          <ApianMap
            initialViewState={{
              longitude: userLocation?.lon, // Longitude of the center point
              latitude: userLocation?.lat, // Latitude of the center point
              zoom: 16, // Initial zoom level
              pitch: 0, // Pitch angle
              bearing: 0, // Bearing angle
            }}
            onClick={(event) => {
              const coordinates = event.lngLat; // Get the coordinates of the click
              const lon = coordinates.lng; // Longitude
              const lat = coordinates.lat; // Latitud
              setManualDronePosition({ lat, lon });
            }}
            ref={mapRef}
          >
            <Marker
              rotation={heading ?? 0}
              latitude={userLocation?.lat!}
              longitude={userLocation?.lon!}
            >
              <ArrowMarker className="w-10"></ArrowMarker>
            </Marker>
            {dronePosition && (
              <Marker
                latitude={dronePosition.lat}
                longitude={dronePosition.lon}
              >
                <Drone></Drone>
              </Marker>
            )}
          </ApianMap>
        </div>
      </SlidePanel>
    </>
  );
};

export default ARTracker;
