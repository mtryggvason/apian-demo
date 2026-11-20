import { simpleCoord } from "@/lib/types/coordinates";

/** Assumed cruise height above ground in metres (the API has no altitude). */
export const CRUISE_ALTITUDE_M = 100;
/** Fraction of the route spent climbing at the start and descending at the end. */
const RAMP_FRACTION = 0.15;
const METRES_PER_DEGREE_LAT = 110_540;
const METRES_PER_DEGREE_LON_AT_EQUATOR = 111_320;

export type Vec3 = [number, number, number];

/**
 * Converts a lat/lon/altitude to local three.js coordinates around `origin`
 * (metres): x = east, y = up, z = south (so -z is north). A flat-earth
 * approximation, which is accurate to well under a metre over a few km.
 */
export const toLocalPosition = (
  origin: simpleCoord,
  point: simpleCoord,
  altitude = 0,
): Vec3 => {
  const east =
    (point.lon - origin.lon) *
    METRES_PER_DEGREE_LON_AT_EQUATOR *
    Math.cos((origin.lat * Math.PI) / 180);
  const north = (point.lat - origin.lat) * METRES_PER_DEGREE_LAT;
  return [east, altitude, -north];
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Altitude at fraction `t` (0..1) of the route: climb, cruise, descend. */
export const altitudeAlongPath = (t: number) =>
  CRUISE_ALTITUDE_M *
  smoothstep(0, RAMP_FRACTION, t) *
  smoothstep(0, RAMP_FRACTION, 1 - t);

/** Points along the route from source to destination, in local coordinates. */
export const buildPathPoints = (
  origin: simpleCoord,
  source: simpleCoord,
  destination: simpleCoord,
  segments = 64,
): Vec3[] =>
  Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const point = {
      lat: source.lat + (destination.lat - source.lat) * t,
      lon: source.lon + (destination.lon - source.lon) * t,
    };
    return toLocalPosition(origin, point, altitudeAlongPath(t));
  });

/** How far along the source→destination line `point` is (0..1), by projection. */
export const progressAlongPath = (
  source: simpleCoord,
  destination: simpleCoord,
  point: simpleCoord,
) => {
  const [dx, , dz] = toLocalPosition(source, destination);
  const [px, , pz] = toLocalPosition(source, point);
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return 0;
  return Math.min(Math.max((px * dx + pz * dz) / lengthSquared, 0), 1);
};
