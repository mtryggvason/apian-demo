import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { APIAN_OFFICE_LOCATION } from "@/lib/constants/locationConstants";

import "@testing-library/jest-dom";

import { ApianMap } from "./ApianMap";
const mockZoomIn = jest.fn();
const mockZoomOut = jest.fn();
const mockResize = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: () => ({
    current: {
      zoomIn: () => {
        mockZoomIn();
      },
      zoomOut: () => {
        mockZoomOut();
      },
      resize: () => {
        mockResize();
      },
    },
  }),
}));

jest.mock("react-map-gl", () => ({
  Map: ({ initialViewState, children, onLoad }) => {
    setTimeout(() => {
      onLoad();
    }, 500);
    return (
      <span>
        <span>{JSON.stringify(initialViewState)}</span>
        MAP
        {children}
      </span>
    );
  },
}));

describe("Apian Map", () => {
  it("renders a map and zoom in/out-buttons when showcontrols is true as well as controls classname and default location", async () => {
    const { container } = render(
      <ApianMap controlsClassName="test-class" showControls={true}></ApianMap>,
    );

    // Shows a loading skeleton initally
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();

    // Apian office is the default location
    expect(
      screen.getByText(APIAN_OFFICE_LOCATION.lat, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(APIAN_OFFICE_LOCATION.lon, { exact: false }),
    ).toBeInTheDocument();

    await waitFor(() => {
      // Loading screen disappears
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();

      expect(screen.getByText("MAP")).toBeInTheDocument();
      expect(screen.getByTestId("minus-icon-medium")).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon-medium")).toBeInTheDocument();
      expect(container.getElementsByClassName("test-class")).toHaveLength(1);

      const zoomInButton = screen.getByTestId("plus-icon-medium");
      const zoomOutButton = screen.getByTestId("minus-icon-medium");
      expect(mockResize).toHaveBeenCalled();

      fireEvent.click(zoomInButton);
      expect(mockZoomIn).toHaveBeenCalled();

      fireEvent.click(zoomOutButton);
      expect(mockZoomOut).toHaveBeenCalled();
    });
  });
  it("renders a map and without zoom in/out-button when showControls is false", async () => {
    render(<ApianMap controlsClassName="" showControls={false}></ApianMap>);
    await waitFor(() => {
      expect(screen.getByText("MAP")).toBeInTheDocument();
      expect(screen.queryByTestId("zoom-in")).not.toBeInTheDocument();
      expect(screen.queryByTestId("zoom-out")).not.toBeInTheDocument();
    });
  });
});
