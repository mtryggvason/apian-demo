// src/Arrow.js
import React, { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculateBearingAndElevation } from '@/utils/geoUtils';

export function Arrow({ userLocation, targetLocation }) {
  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [orientation, setOrientation] = useState({ bearing: 0, elevation: 0 });

  useEffect(() => {
    if (userLocation && targetLocation) {
      const { lat, lng, altitude } = userLocation;
      const target = {
        latitude: targetLocation.lat,
        longitude: targetLocation.lng,
        altitude: targetLocation.altitude || 0, // Use 0 if no altitude is provided
      };
      const newOrientation = calculateBearingAndElevation(
        lat,
        lng,
        altitude || 0, // Use 0 if no altitude is provided
        target.latitude,
        target.longitude,
        target.altitude
      );
      setOrientation(newOrientation);
    }
  }, [userLocation, targetLocation]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const { alpha, beta, gamma } = event; // Rotation around the Z, X, and Y axes respectively
      setRotation(new THREE.Euler(
        THREE.MathUtils.degToRad(beta - orientation.elevation),  // Pitch
        THREE.MathUtils.degToRad(gamma),                         // Roll
        THREE.MathUtils.degToRad(alpha - orientation.bearing)    // Yaw
      ));
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      alert('DeviceOrientationEvent is not supported on your device/browser.');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={rotation}>
        {/* Arrow shaft */}
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="blue" />
        {/* Arrowhead */}
        <mesh position={[0, 2, 0]}>
          <coneGeometry args={[0.4, 1, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </mesh>
    </>
  );
}

export default Arrow;
