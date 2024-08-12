import { bearing, distance as turfDistance, point } from "@turf/turf";

const calculateBearing = (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
) => {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const dLng = destLngRad - startLngRad;

  const y = Math.sin(dLng) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(dLng);
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360; // Normalize to 0-360 degrees
};

import { MathUtils } from "three";

export const calculateBearingAndElevation = (
  startLat: number,
  startLng: number,
  startAlt: number,
  destLat: number,
  destLng: number,
  destAlt: number,
) => {
  // Create Turf.js point objects
  const startPoint = point([startLng, startLat]);
  const destPoint = point([destLng, destLat]);

  // Calculate the horizontal distance between the two points in meters
  const horizontalDistance = turfDistance(startPoint, destPoint, {
    units: "meters",
  });

  // Calculate the bearing using the great-circle formula
  const startLatRad = MathUtils.degToRad(startLat);
  const startLngRad = MathUtils.degToRad(startLng);
  const destLatRad = MathUtils.degToRad(destLat);
  const destLngRad = MathUtils.degToRad(destLng);

  const dLng = destLngRad - startLngRad;
  const y = Math.sin(dLng) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(dLng);
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;
  const bearing = (bearingDeg + 360) % 360; // Normalize to 0-360 degrees

  // Calculate the vertical height difference
  const heightDifference = destAlt - startAlt;

  // Calculate the 3D distance (hypotenuse)
  const distance3D = Math.sqrt(horizontalDistance ** 2 + heightDifference ** 2);

  // Calculate the elevation angle in degrees
  const elevationRad = Math.atan2(heightDifference, horizontalDistance);
  const elevationDeg = (elevationRad * 180) / Math.PI;

  return { bearing, elevation: elevationDeg };
};
