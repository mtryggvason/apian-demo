// src/Arrow.js
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { calculateBearingAndElevation, isTargetInView } from "@/utils/geoUtils";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

export function Arrow({ userLocation, targetLocation }: any) {
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [orientation, setOrientation] = useState({ bearing: 0, elevation: 0 });
  const [isInview, setIsInView] = useState(false);

  useEffect(() => {
    if (userLocation && targetLocation) {
      const { lat, lon, altitude } = userLocation;
      const target = {
        latitude: targetLocation.lat,
        longitude: targetLocation.lon,
        altitude: targetLocation.altitude || 0,
      };
      const newOrientation = calculateBearingAndElevation(
        lat,
        lon,
        altitude,
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
      const { beta } = event;
      compassdir = event.webkitCompassHeading;
      if (beta > 135 || beta < -135) {
        compassdir = 180 + event.webkitCompassHeading;
      }
    } else compassdir = event.alpha;
    return Math.floor(compassdir);
  };

  const debouncedOrientation = useDebounceCallback((event: any) => {
    const { alpha, beta, gamma } = event;

    // Get the compass heading (adjust for different devices if necessary)
    const compassHeading = getUserHeading(event);

    // Calculate the direction to the target relative to the current heading
    let directionToTarget = compassHeading - orientation.bearing;

    // Normalize direction to a 0-360 degree range
    directionToTarget = (directionToTarget + 360) % 360;

    // Calculate yaw from the direction to target
    const yaw = THREE.MathUtils.degToRad(directionToTarget);

    const pitchFromElevation = THREE.MathUtils.degToRad(orientation.elevation);

    let normalizedBeta = beta < 0 ? 360 + beta : beta;
    normalizedBeta = Math.min(normalizedBeta, 360);

    // Calculate pitch based directly on device tilt (beta)
    // If the device is held flat, beta is near 0. If tilted upwards, beta is negative.
    // We reverse pitch if necessary based on how `beta` is reported.
    const deviceTiltPitch = THREE.MathUtils.degToRad(normalizedBeta);
    const pitch = pitchFromElevation - deviceTiltPitch;

    const roll = THREE.MathUtils.degToRad(0);

    setRotation(
      new THREE.Euler(
        pitch, // Pitch: Up/Down, controlled by beta
        roll, // Roll: Tilt left/right, usually 0
        yaw, // Yaw: Horizontal rotation
      ),
    );
    setIsInView(
      isTargetInView(
        compassHeading,
        normalizedBeta - 90,
        orientation.bearing,
        orientation.elevation,
      ),
    );
  }, 10);

  useEventListener("deviceorientation", debouncedOrientation);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={rotation}>
        {/* Smaller Arrow Shaft */}
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />{" "}
        {/* Reduced the radius and height */}
        <meshStandardMaterial color={isInview ? "blue" : "red"} />
        {/* Smaller Arrowhead */}
        <mesh position={[0, 1.5, 0]}>
          {/* Adjusted position for the smaller shaft */}
          <coneGeometry args={[0.3, 0.75, 32]} />{" "}
          {/* Reduced the radius and height */}
          <meshStandardMaterial color={isInview ? "blue" : "red"} />
        </mesh>
      </mesh>
    </>
  );
}

export default Arrow;
