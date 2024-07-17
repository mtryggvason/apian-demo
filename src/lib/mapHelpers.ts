import {
  bbox,
  center,
  distance,
  featureCollection,
  lineSlice,
  lineString,
  point,
  pointOnLine,
} from "@turf/turf";
import { Feature, GeoJsonProperties, LineString, Point } from "geojson";
import { FitBoundsOptions, LngLatBounds, LngLatBoundsLike } from "mapbox-gl";

import { KILOMETERS } from "@/lib/constants/unitConstant";
import { simpleCoord, turfCoord } from "@/lib/types/coordinates";

export function getRouteDistanceKm(
  startCoords: turfCoord,
  endCoords: turfCoord
): number {
  // Create Turf.js points from the coordinates
  const startPoint = point(startCoords);
  const endPoint = point(endCoords);

  // Calculate the distance between the two points using Turf.js
  const units = KILOMETERS;
  return distance(startPoint, endPoint, { units });
}

export function getRouteCenter(
  startCoords: turfCoord,
  endCoords: turfCoord
): Feature<Point, GeoJsonProperties> {
  const features = featureCollection([point(startCoords), point(endCoords)]);
  return center(features);
}

export function getRouteZoomLevel(distanceKM: number): number {
  // todo: this can be improved, just an approximation for now
  let zoomLevel: number = 12;
  if (distanceKM > 3.0) {
    zoomLevel = 11;
  }
  if (distanceKM > 5.0) {
    zoomLevel = 10;
  }
  if (distanceKM > 10) {
    zoomLevel = 9;
  }
  if (distanceKM > 20) {
    zoomLevel = 8;
  }

  return zoomLevel;
}

export function calculateRouteInitialViewState(
  startLocation: simpleCoord,
  endLocation: simpleCoord
): {
  latitude: number;
  longitude: number;
  zoom: number;
} {
  const distance = getRouteDistanceKm(
    [startLocation.lon, startLocation.lat],
    [endLocation.lon, endLocation.lat]
  );
  const centerCoordinates = getRouteCenter(
    [startLocation.lon, startLocation.lat],
    [endLocation.lon, endLocation.lat]
  );
  const initialZoomLevel = getRouteZoomLevel(distance);

  return {
    latitude: centerCoordinates.geometry.coordinates[1],
    longitude: centerCoordinates.geometry.coordinates[0],
    zoom: initialZoomLevel,
  };
}

export function calculateRouteInitialViewStateByBounds(
  startLocation: simpleCoord,
  endLocation: simpleCoord
): {
  bounds: LngLatBoundsLike;
  fitBoundsOptions: FitBoundsOptions;
} {
  return {
    bounds: [
      [startLocation.lon, startLocation.lat],
      [endLocation.lon, endLocation.lat],
    ],
    fitBoundsOptions: {
      padding: 40,
    },
  };
}

export const getLineSourceData = (coordinateArray: any[], layerId: string) => {
  return {
    id: layerId,
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinateArray,
    },
  };
};

/**
 * Creats a subsegment of the line which assumed to be travelled based from the currentLocation to the line.
 * @param currentLocation Point representing the current location of the drone/object, might or might not be on the line.
 * @param line Line to be split - e.g. total path between to locations
 * @returns A segment showing the progress of the drone/object along the line.
 */
export const createProgressedSegment = (
  currentLocation: Feature<Point, GeoJsonProperties>,
  line: Feature<LineString, GeoJsonProperties>
) => {
  const nearestPoint = pointOnLine(line, currentLocation);
  return lineSlice(point(line.geometry.coordinates.at(0)!), nearestPoint, line);
};

export const simpleCoordToArray = ({ lat, lon }: simpleCoord) => [lon, lat];
export const simpleCoordToPoint = ({ lat, lon }: simpleCoord) => {
  return point([lon, lat]);
};

export const simpleCoordToBoundingBox = (points: Array<simpleCoord>) => {
  const line = lineString(points.map(simpleCoordToArray));
  return bbox(line);
};

export const boundingBoxToParams = (bb: LngLatBounds) => {
  const params = new URLSearchParams();
  if (
    !bb?.getNorthWest().lat ||
    !bb?.getNorthWest().lng ||
    !bb?.getSouthEast().lat ||
    !bb?.getSouthEast().lng
  ) {
    throw new Error("Bound box is missing points");
  }
  params.append("bounding_box_point_a_lat", bb.getNorthWest().lat.toString());
  params.append("bounding_box_point_a_lon", bb.getNorthWest().lng.toString());
  params.append("bounding_box_point_b_lat", bb.getSouthEast().lat.toString());
  params.append("bounding_box_point_b_lon", bb.getSouthEast().lng.toString());
  return params;
};
