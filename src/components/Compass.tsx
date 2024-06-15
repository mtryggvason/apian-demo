// src/Arrow.js
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { calculateBearingAndElevation } from "@/utils/geoUtils";

export function Arrow({ userLocation, targetLocation }: any) {
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [orientation, setOrientation] = useState({ bearing: 0, elevation: 0 });

  useEffect(() => {
    if (userLocation && targetLocation) {
      const { lat, lng, altitude } = userLocation;
      const target = {
        latitude: targetLocation.lat,
        longitude: targetLocation.lng,
        altitude: targetLocation.altitude || 0,
      };
      const newOrientation = calculateBearingAndElevation(
        lat,
        lng,
        altitude || 0,
        target.latitude,
        target.longitude,
        target.altitude
      );
      setOrientation(newOrientation);
    }
  }, [userLocation, targetLocation]);

  useEffect(() => {
    const handleOrientation = (event: any) => {
      const { alpha, beta, gamma, webkitCompassHeading } = event;
      const compassHeading = webkitCompassHeading ?? Math.abs(alpha - 360); // Fallback to alpha if webkitCompassHeading is not available

      const directionToTarget = compassHeading + orientation.bearing;
      console.log;
      setRotation(
        new THREE.Euler(
          THREE.MathUtils.degToRad(0), // Pitch (tilt forward/backward)
          THREE.MathUtils.degToRad(0), // Roll (tilt left/right)
          THREE.MathUtils.degToRad(directionToTarget) // Yaw (heading/rotation around vertical axis)
        )
      );
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      alert("DeviceOrientationEvent is not supported on your device/browser.");
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={rotation}>
        {/* Arrow shaft */}
        <cylinderGeometry args={[0.3, 0.3, 6, 32]} />
        <meshStandardMaterial color="blue" />
        {/* Arrowhead */}
        <mesh position={[0, 3, 0]}>
          <coneGeometry args={[0.6, 1.5, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </mesh>
    </>
  );
}

export default Arrow;
