// src/Arrow.js
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { calculateBearingAndElevation } from "@/utils/geoUtils";

export function Arrow({ userLocation, targetLocation }: any) {
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [orientation, setOrientation] = useState({ bearing: 0, elevation: 0 });

  useEffect(() => {
    if (userLocation && targetLocation) {
      const { lat, lon, altitude } = userLocation;
      const target = {
        latitude: targetLocation.lat,
        longitude: targetLocation.lng,
        altitude: targetLocation.altitude || 0,
      };
      console.log(target.altitude);
      const newOrientation = calculateBearingAndElevation(
        lat,
        lon,
        0,
        target.latitude,
        target.longitude,
        target.altitude,
      );
      setOrientation(newOrientation);
    }
  }, [userLocation, targetLocation]);

  const getUserHeading = (event: any) => {
    let compassdir;
    if (event.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      compassdir = event.webkitCompassHeading;
    } else compassdir = event.alpha;
    return Math.floor(compassdir);
  };

  useEffect(() => {
    const handleOrientation = (event: any) => {
      const { alpha, beta, gamma, webkitCompassHeading } = event;

      // Get the compass heading (adjust for different devices if necessary)
      const compassHeading = getUserHeading(event);

      // Calculate the direction to the target relative to the current heading
      let directionToTarget = compassHeading - orientation.bearing;

      // Normalize direction to a 0-360 degree range
      directionToTarget = (directionToTarget + 360) % 360;

      // Calculate yaw, pitch, and roll
      const yaw = THREE.MathUtils.degToRad(directionToTarget); // Horizontal direction
      const pitch = THREE.MathUtils.degToRad(orientation.elevation); // Vertical tilt
      const roll = THREE.MathUtils.degToRad(0); // Tilt left/right

      // Apply the rotation with yaw, pitch, and roll
      setRotation(
        new THREE.Euler(
          pitch, // Pitch: Up/Down
          roll, // Roll: Tilt left/right
          yaw, // Yaw: Horizontal rotation
        ),
      );
    };

    window.addEventListener("deviceorientation", handleOrientation);
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
