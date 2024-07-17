import { describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";

import { boundingBoxMockCall } from "@/lib/testHelpers/mapMocks";
import { useSessionAuthenticated } from "@/lib/testHelpers/mocks";

import "@testing-library/jest-dom";

import { NearbyTransfers } from "./NearbyTransfers";

let results = [
  {
    code: "XYZ123",
    current_position: { lat: 40.7128, lon: -74.006 }, // New York
    current_heading: 90,
  },
  {
    code: "ABC456",
    current_position: { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    current_heading: 180,
  },
  // Add more mock nearby transfers as needed
];

jest.mock("lib/apiEndpointsHelper", () => {
  const loadNearbyTransfers = () => {
    return { results };
  };
  return { loadNearbyTransfers };
});

const drone1 =
  results[0].current_position.lat + " - " + results[0].current_position.lon;
const drone2 =
  results[1].current_position.lat + " - " + results[1].current_position.lon;

describe("NearbyTransfersComponent", () => {
  useSessionAuthenticated();
  it("renders nearby transfers", async () => {
    render(<NearbyTransfers></NearbyTransfers>);
    await waitFor(() => {
      expect(screen.getByText(drone1)).toBeInTheDocument();
      expect(screen.getByText(drone2)).toBeInTheDocument();
    });
  });
  it("it called getBounding box", () => {
    render(<NearbyTransfers></NearbyTransfers>);
    expect(boundingBoxMockCall).toHaveBeenCalled();
  });
});
