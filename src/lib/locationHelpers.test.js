import { describe, expect, it } from "@jest/globals";

import { buildMapboxStaticImageUrl } from "./locationHelpers";

const mockLocationDetail = {
  coordinates: {
    lon: 1,
    lat: 2,
  },
};

describe("The buildMapboxStaticImageUrl() helper", () => {
  it("returns expected result", () => {
    const result = buildMapboxStaticImageUrl(mockLocationDetail);
    expect(result).toContain("https://api.mapbox.com/styles/v1/");
    expect(result).toContain(
      `${mockLocationDetail.coordinates.lon},${mockLocationDetail.coordinates.lat}`,
    );
  });
});
