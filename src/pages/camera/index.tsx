import { Arrow } from "@/components/Compass";
import { Canvas } from "@react-three/fiber";
import { LngLat } from "mapbox-gl";
import React, { useState } from "react";
import { useWindowSize } from "react-use";
import Webcam from "react-webcam";

const WebcamComponent = () => {
  const { width, height } = useWindowSize()
  const videoConstraints = {
    facingMode: { exact: "environment" }
  };
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<Lng|null>(null);
  const requestPermission = () => {
    getGyroscopePermission();
    getUserLocation();
  }

  const getGyroscopePermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === 'granted') {
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
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (<div>
    <Webcam videoConstraints={videoConstraints} width={width} height={height} />
    {hasPermission && (<Canvas>
      <Arrow userLocation={{lat: 1.5001, lng: .1182}} targetLocation={{lat: 51.5001, lng: 0.1182}}  />
    </Canvas>)
    }
    {!hasPermission && <button onClick={requestPermission} class="z-10 absolute bottom-2 left-1/2 transform -translate-x-1/2  mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Get Started!     {userLocation?.lat}
</button>}
    </div>
   )
}


export default WebcamComponent;