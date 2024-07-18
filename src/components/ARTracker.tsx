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

export const ARTracker = () => {
  const canvasRef = useRef<any>();
  const mapRef = useRef<any>();
  const [orientation, setOrientation] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<simpleCoord | null>(null);
  const ar = useMemo(() => {
    return <ARView />;
  }, []);
  const requestPermission = () => {
    getUserLocation();
    getGyroscopePermission();
  };

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      setOrientation((orientation) => (orientation ? 0 : 1));
    });
  }, []);
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
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const handleOrientation = (event: any) => {
      if (!hasPermission) return;
      const { beta } = event; // beta gives the tilt in the Y axis
      if (parseInt(beta) > 30) {
        setOrientation(1);
      } else {
        setOrientation(0);
      }
    };
    if (hasPermission) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [hasPermission]);

  useEffect(() => {
    // beta gives the tilt in the Y axis
    if (orientation === 1) {
      canvasRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      mapRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [orientation]);

  let unit = "KM";
  const drone = userLocation ? getClosestTracking(userLocation) : null;
  console.log(drone);
  let distanceFromDrone = userLocation
    ? distance(
        simpleCoordToPoint(userLocation),
        simpleCoordToPoint(drone?.tracking?.current_position!),
        { units: KILOMETERS }
      )
    : 0;
  if (distanceFromDrone < 1) {
    distanceFromDrone = distanceFromDrone * 1000;
    unit = "M";
  }
  return (
    <>
      <div ref={canvasRef} className="relative h-[calc(100dvh)]" id="webcam">
        {userLocation && ar}
        {hasPermission && userLocation && (
          <>
            <div className="absolute bottom-[100px] flex left-1/2 transform -translate-x-1/2  mt-2 flex-col">
              <Canvas>
                <Arrow
                  userLocation={userLocation}
                  targetLocation={{ lat: 48.1858, lng: 16.3128 }}
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
        <div className="relative" ref={mapRef}>
          <DeliveryTracker />
        </div>
      )}
    </>
  );
};

export default ARTracker;
