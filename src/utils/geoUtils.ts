import { bearing, point, rhumbBearing } from "@turf/turf";

// utils/geoUtils.js
export const calculateBearingAndElevation = (startLat, startLng, startAlt, destLat, destLng, destAlt) => {
    const startLatRad = (startLat * Math.PI) / 180;
    const startLngRad = (startLng * Math.PI) / 180;
    const destLatRad = (destLat * Math.PI) / 180;
    const destLngRad = (destLng * Math.PI) / 180;
  
    const dLng = destLngRad - startLngRad;
    const bearing = rhumbBearing(point([startLng, startLat]), point([destLng, destLat]))
  
    // Calculate elevation
    const dLat = destLatRad - startLatRad;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng);
    const height = destAlt - startAlt;
    const elevationRad = Math.atan2(height, distance);
    const elevationDeg = (elevationRad * 180) / Math.PI;
  
    return { bearing, elevation: elevationDeg };
  };
  