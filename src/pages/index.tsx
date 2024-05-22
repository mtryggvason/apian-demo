import { Arrow } from "@/components/Compass";
import { DroneButton } from "@/components/icons/DroneButton";
import { Canvas } from "@react-three/fiber";
import { LngLat, LngLatLike } from "mapbox-gl";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker } from "react-map-gl";
import { useDebounce, useWindowSize } from "react-use";
import Webcam from "react-webcam";

interface Position {
  lat: number;
  lng: number;
}

const WebcamComponent = () => {
  const canvasRef = useRef<any>();
  const mapRef = useRef<any>();
  const { width, height } = useWindowSize();
  const videoConstraints = {
    facingMode: { exact: "environment" },
  };
  const [orientation, setOrientation] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<Position | null>(null);
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
            lng: position.coords.longitude,
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
      if (parseInt(beta) > 50) {
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
      mapRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      debugger;
      canvasRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [orientation]);

  return (
    <>
      <div className="relative h-screen" id="webcam">
        <Webcam
          videoConstraints={videoConstraints}
          width={width}
          height={height}
        />
        {hasPermission && userLocation && (
          <>
            <div
              ref={canvasRef}
              className="absolute bottom-10  left-1/2 transform -translate-x-1/2  mt-2"
            >
              <Canvas>
                <Arrow
                  userLocation={{ lat: 1.5001, lng: 0.087 }}
                  targetLocation={userLocation}
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
      {userLocation && (
        <div className="relative h-screen" ref={mapRef.current}>
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_KEY}
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 16,
            }}
            scrollZoom={false}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/standard"
          >
            <Marker latitude={userLocation.lat} longitude={userLocation.lng}>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
              </span>
            </Marker>
          </Map>
        </div>
      )}

      {!hasPermission && (
        <button
          onClick={requestPermission}
          className="z-10 fixed top-2 left-1/2 transform -translate-x-1/2  mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Get Started!
        </button>
      )}
    </>
  );
};

export default WebcamComponent;
