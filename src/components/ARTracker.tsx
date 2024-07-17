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

  return (
    <>
      <div ref={canvasRef} className="relative h-[calc(100dvh)]" id="webcam">
        {userLocation && ar}
        {hasPermission && userLocation && (
          <>
            <div className="absolute bottom-[100px]  left-1/2 transform -translate-x-1/2  mt-2">
              <Canvas>
                <Arrow
                  userLocation={userLocation}
                  targetLocation={{ lat: 48.1858, lng: 16.3128 }}
                />
              </Canvas>
            </div>
            <Link
              href="/drone"
              className="absolute shadow-sm bottom-2 left-1/2 transform -translate-x-1/2  mt-2 active:invert"
            >
              <DroneButton />
            </Link>
          </>
        )}
      </div>
      {!userLocation && (
        <Card className="absolute left-0 right-0 top-0 bottom-0 text-center inline-block p-4 max-w-[350px] h-[120px] m-auto">
          <Text>
            To use the AR Tracking Capabilities we need to access your location
            and camera!
          </Text>
          <StyledButton
            size="smRoundedFull"
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
