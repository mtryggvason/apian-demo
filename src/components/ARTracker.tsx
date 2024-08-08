import { Arrow } from "@/components/Compass";
import { DroneButton } from "@/components/icons/DroneButton";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ARView from "@/components/AR";
import { DeliveryTracker } from "@/components/maps/DeliveryTracker";
import StyledButton from "@/components/buttons/StyledButton";
import { Card } from "@/components/cards/Card";
import Text from "@/components/typography/Text";
import { simpleCoord } from "@/lib/types/coordinates";
import { distance } from "@turf/turf";
import { simpleCoordToPoint } from "@/lib/mapHelpers";
import { KILOMETERS } from "@/lib/constants/unitConstant";
import { getClosestTracking } from "@/utils/transferGenerator";
import { useDebounceCallback, useInterval } from "usehooks-ts";
import { ApianMap } from "@/components/maps/ApianMap";
import { Marker } from "react-map-gl";
import { ArrowMarker } from "@/components/icons/ArrowMarker";
import mqtt from "mqtt";
import { Drone } from "@/components/icons/Drone";

interface simpleCoordWithHeading extends simpleCoord {
  heading?: number | null;
}

export const ARTracker = () => {
  const [render, setRender] = useState(false);
  useInterval(() => {
    setRender((r) => !r);
  }, 1000);
  const canvasRef = useRef<any>();
  const mapRef = useRef<any>();
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] =
    useState<simpleCoordWithHeading | null>(null);
  const clientRef = useRef<any>(null);
  const [heading, setHeading] = useState(0);
  const [dronePosition, setDronePosition] = useState<simpleCoord | null>(null);

  const ar = useMemo(() => {
    return <ARView />;
  }, []);
  const requestPermission = () => {
    getUserLocation();
    getGyroscopePermission();
  };

  useEffect(() => {
    clientRef.current = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");
    clientRef.current.on("connect", () => {
      clientRef.current.subscribe("apian-drone-position");
    });

    clientRef.current.on("message", (topic: any, message: any) => {
      const messageAsJSON = JSON.parse(message.toString());
      setDronePosition(messageAsJSON);
    });
  }, []);

  const handleOrientation = useDebounceCallback((event) => {
    let compassdir;
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

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
    distanceFromDrone = distanceFromDrone * 1000;
    unit = "M";
  }
  return (
    <>
      {
        <div ref={canvasRef} className="relative h-[calc(100dvh)]" id="webcam">
          {userLocation && ar}
          {hasPermission && userLocation && (
            <>
              <div className="absolute bottom-[100px] flex left-1/2 transform -translate-x-1/2  mt-2 flex-col">
                <Canvas>
                  <Arrow
                    userLocation={userLocation}
                    targetLocation={
                      dronePosition
                        ? { lat: dronePosition.lat, lng: dronePosition.lon }
                        : { lat: 48.1858, lng: 16.3128 }
                    }
                  />
                </Canvas>
                <div className="bg-apian-yellow p-2 rounded-md text-center">
                  <Text textSize="h2Bold">
                    Distance to drone: {distanceFromDrone.toFixed(1)} {unit}
                  </Text>
                </div>
                <Link
                  href="/drone"
                  className="shadow-sm bottom-2 block mx-auto mt-4 active:invert"
                >
                  <DroneButton />
                </Link>
              </div>
            </>
          )}
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
      {userLocation && (
        <div className="h-screen w-screen">
          <ApianMap
            initialViewState={{
              longitude: userLocation.lon, // Longitude of the center point
              latitude: userLocation.lat, // Latitude of the center point
              zoom: 16, // Initial zoom level
              pitch: 0, // Pitch angle
              bearing: 0, // Bearing angle
            }}
            ref={mapRef}
          >
            <Marker
              rotation={heading ?? 0}
              latitude={userLocation.lat}
              longitude={userLocation?.lon}
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
      )}
    </>
  );
};

export default ARTracker;
