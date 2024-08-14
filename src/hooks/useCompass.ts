import { simpleCoordWithHeading } from "@/components/ARTracker";
import { calculateBearingAndElevation, isTargetInView } from "@/utils/geoUtils";
import { useEffect, useState } from "react";
import { Euler, MathUtils } from "three";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

export const useCompass = (
  userLocation?: simpleCoordWithHeading,
  targetLocation?: simpleCoordWithHeading,
) => {
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));
  const [orientation, setOrientation] = useState({ bearing: 0, elevation: 0 });
  const [isInView, setIsInView] = useState(false);
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
        altitude ?? 0,
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
    const yaw = MathUtils.degToRad(directionToTarget);

    const pitchFromElevation = MathUtils.degToRad(orientation.elevation);

    let normalizedBeta = beta < 0 ? 360 + beta : beta;
    normalizedBeta = Math.min(normalizedBeta, 360);

    // Calculate pitch based directly on device tilt (beta)
    // If the device is held flat, beta is near 0. If tilted upwards, beta is negative.
    // We reverse pitch if necessary based on how `beta` is reported.
    const deviceTiltPitch = MathUtils.degToRad(normalizedBeta);
    const pitch = pitchFromElevation - deviceTiltPitch;

    const roll = MathUtils.degToRad(0);

    setRotation(
      new Euler(
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
  return { rotation, isInView };
};
