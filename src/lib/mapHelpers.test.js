import { describe, expect, it } from "@jest/globals";
import { lineString, point } from "@turf/turf";

import { testLocation1, testLocation2 } from "./testHelpers/mockData";
import {
  boundingBoxToParams,
  calculateRouteInitialViewState,
  createProgressedSegment,
  getLineSourceData,
  getRouteCenter,
  getRouteDistanceKm,
  getRouteZoomLevel,
  simpleCoordToBoundingBox,
} from "./mapHelpers";

describe("The getRouteDistanceKm() helper function", () => {
  it("returns correct information", () => {
    const distance = getRouteDistanceKm(
      [testLocation1.lon, testLocation1.lat],
      [testLocation2.lon, testLocation2.lat],
    );

    expect(typeof distance).toBe("number");
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(3);
  });
});

describe("The getRouteCenter() helper function", () => {
  it("returns correct information", () => {
    const center = getRouteCenter(
      [testLocation1.lon, testLocation1.lat],
      [testLocation2.lon, testLocation2.lat],
    );

    const lat = center.geometry.coordinates[1];
    const lng = center.geometry.coordinates[0];
    expect(lat).toBeGreaterThanOrEqual(-50);
    expect(lat).toBeLessThanOrEqual(52);
    expect(lng).toBeGreaterThanOrEqual(-1);
    expect(lng).toBeLessThanOrEqual(0);
  });
});

describe("The getRouteZoomLevel() helper function", () => {
  it.each([
    { distance: 0, expected: 12 },
    { distance: 3.5, expected: 11 },
    { distance: 6, expected: 10 },
    { distance: 11, expected: 9 },
    { distance: 21, expected: 8 },
  ])("returns correct zoom levels", (data) => {
    const { distance, expected } = data;
    expect(getRouteZoomLevel(distance)).toEqual(expected);
  });
});

describe("The calculateRouteInitialViewState() helper function", () => {
  it("returns correct information", () => {
    const viewState = calculateRouteInitialViewState(
      testLocation1,
      testLocation2,
    );

    const lat = viewState.latitude;
    const lng = viewState.longitude;
    const zoom = viewState.zoom;
    expect(typeof lat).toBe("number");
    expect(lat).toBeGreaterThanOrEqual(51);
    expect(lat).toBeLessThanOrEqual(52);
    expect(typeof lng).toBe("number");
    expect(lng).toBeGreaterThanOrEqual(-1);
    expect(lng).toBeLessThanOrEqual(0);
    expect(typeof zoom).toBe("number");
    expect(zoom).toBeGreaterThan(0);
  });
});

describe("The getLineSourceData() helper function", () => {
  it("returns correct information", () => {
    const layerId = "testId";
    const routeData = [
      [testLocation1.lon, testLocation1.lat],
      [testLocation2.lon, testLocation2.lat],
    ];
    const data = getLineSourceData(routeData, layerId);

    expect(data.id).toBe(layerId);
    expect(data.geometry.coordinates).toBe(routeData);
  });

  describe("the createProgressedSegment helper function", () => {
    it("returns subpath from startPoint to currentPoint", () => {
      const currentPoint = point([1.5, 1.5]);
      const line = lineString([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ]);

      const result = createProgressedSegment(currentPoint, line);

      const expectedResult = lineString([
        [0, 0],
        [1, 1],
        [1.4998285945392045, 1.4998285945392045],
      ]);

      // Check each coordinate individually and up to 15 places beheind decimal point
      result.geometry.coordinates.forEach((coord, index) => {
        expect(coord[0]).toBeCloseTo(
          expectedResult.geometry.coordinates[index][0],
          15,
        );
        expect(coord[1]).toBeCloseTo(
          expectedResult.geometry.coordinates[index][1],
          15,
        );
      });
    });

    it("returns subpath even if current point is not on the line", () => {
      const currentPoint = point([1, 3.4]);
      const line = lineString([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ]);

      const result = createProgressedSegment(currentPoint, line);

      const expectedResult = lineString([
        [0, 0],
        [1, 1],
        [2, 2],
        [2.2003170638851097, 2.2003170638851097],
      ]);

      expect(result).toEqual(expectedResult);
    });

    it("returns subpath with a horizontal line", () => {
      const currentPoint = point([4, 1]);
      const line = lineString([
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
      ]);

      const result = createProgressedSegment(currentPoint, line);

      const expectedResult = lineString([
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [4, 1],
      ]);

      expect(result).toEqual(expectedResult);
    });
  });
});

describe("simpleCoordToBoundingBox", () => {
  test("should return correct bounding box for a 2 points", () => {
    const points = [
      { lat: 40.7128, lon: -74.006 },
      { lat: 41.7128, lng: -74.006 },
    ];
    const result = simpleCoordToBoundingBox(points);
    expect(result).toEqual([-74.006, 40.7128, -74.006, 41.7128]);
  });

  test("should return correct bounding box for multiple points", () => {
    const points = [
      { lat: 40.7128, lon: -74.006 }, // New York
      { lat: 34.0522, lon: -118.2437 }, // Los Angeles
      { lat: 41.8781, lon: -87.6298 }, // Chicago
    ];
    const result = simpleCoordToBoundingBox(points);
    expect(result).toEqual([-118.2437, 34.0522, -74.006, 41.8781]);
  });
});

describe("boundingBoxToParams", () => {
  test("should throw and error params when bounding box is null or has missing params", () => {
    let bb = null;
    const testFunction = () => {
      boundingBoxToParams(bb);
    };
    expect(testFunction).toThrow(Error);
    bb = {};
    expect(testFunction).toThrow(Error);
  });

  test("should return correct params for a given bounding box", () => {
    const bb = {
      getNorthWest: () => ({ lat: 40.7128, lng: -74.006 }), // New York
      getSouthEast: () => ({ lat: 34.0522, lng: -118.2437 }), // Los Angeles
    };
    const params = boundingBoxToParams(bb);
    expect(parseFloat(params.get("bounding_box_point_a_lat"))).toBeCloseTo(
      40.7128,
    );
    expect(parseFloat(params.get("bounding_box_point_a_lon"))).toBeCloseTo(
      -74.006,
    );
    expect(parseFloat(params.get("bounding_box_point_b_lat"))).toBeCloseTo(
      34.0522,
    );
    expect(parseFloat(params.get("bounding_box_point_b_lon"))).toBeCloseTo(
      -118.2437,
    );
  });

  test("should ignore null values within the bounding box", () => {
    const bb = {
      getNorthWest: () => ({ lat: null, lng: null }),
      getSouthEast: () => ({ lat: null, lng: null }),
    };
    const testFunction = () => {
      boundingBoxToParams(bb);
    };
    expect(testFunction).toThrow(Error);
  });
});
