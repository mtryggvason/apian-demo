import React from "react";
import { render, waitFor } from "@testing-library/react";

import "@/lib/testHelpers/mapMocks";
import "@testing-library/jest-dom";

import DroneWithPaths from "./DroneWithPaths";

jest.mock("lottie-react", () => {
  return () => {
    return "LOTTIE";
  };
});

describe("AnimatedMarker", () => {
  const defaultProps = {
    tracking: {
      flight_path_coordinates: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      current_position: { lat: 1, lon: 2 },
    },
    routeEndPoint: { lat: 2, lon: 2 },
    routeStartPoint: { lat: -1, lon: 0 },
    showDrone: true,
    animatingFromPosition: { lat: 1, lon: 1 },
    animationDuration: 500,
  };

  it("uses the starting latitude and longitude if provided for initial render", async () => {
    const screen = render(<DroneWithPaths {...defaultProps} />);

    // Poisition is somewhere between 1 - 1 and 1 - 2
    expect(screen.getByTestId("position").textContent).not.toBe("1 - 1");
    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("1 - 2");

      // The routeStartPoint is included in the covered path
      await expect(screen.getByTestId("coveredPath_0").textContent).toBe(
        "0 - -1",
      );
      await expect(screen.getByTestId("coveredPath_1").textContent).toBe(
        "0 - 0",
      );
      await expect(screen.getByTestId("coveredPath_2").textContent).toBe(
        "0 - 1",
      );
      await expect(screen.getByTestId("coveredPath_3").textContent).toBe(
        "1 - 1",
      );
      await expect(screen.getByTestId("coveredPath_4").textContent).toBe(
        "2 - 1",
      );

      await expect(screen.getByTestId("remainingPath_0").textContent).toBe(
        "2 - 1",
      );
      await expect(screen.getByTestId("remainingPath_1").textContent).toBe(
        "2 - 2",
      );
    });
  });

  it("animated to new tracking position", async () => {
    const screen = render(<DroneWithPaths {...defaultProps} />);

    // Poisition is somewhere between 1 - 1 and 1 - 2
    expect(screen.getByTestId("position").textContent).not.toBe("1 - 1");
    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("1 - 2");
    });

    const newProps = { ...defaultProps };
    newProps.tracking = {};
    newProps.tracking.flight_path_coordinates = [
      ...defaultProps.tracking.flight_path_coordinates,
      [2, 1.5],
    ];
    newProps.tracking.current_position = { lat: 1.5, lon: 2 };

    screen.rerender(<DroneWithPaths {...newProps} />);

    // Position is somewhere between 1 - 2 and 1.5 - 2
    expect(screen.getByTestId("position").textContent).not.toBe("1 - 2");

    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("1.5 - 2");

      // The routeStartPoint is included in the covered path
      await expect(screen.getByTestId("coveredPath_0").textContent).toBe(
        "0 - -1",
      );
      await expect(screen.getByTestId("coveredPath_1").textContent).toBe(
        "0 - 0",
      );
      await expect(screen.getByTestId("coveredPath_2").textContent).toBe(
        "0 - 1",
      );
      await expect(screen.getByTestId("coveredPath_3").textContent).toBe(
        "1 - 1",
      );
      await expect(screen.getByTestId("coveredPath_4").textContent).toBe(
        "2 - 1",
      );

      await expect(screen.getByTestId("coveredPath_5").textContent).toBe(
        "2 - 1.5",
      );

      await expect(screen.getByTestId("remainingPath_0").textContent).toBe(
        "2 - 1.5",
      );
      await expect(screen.getByTestId("remainingPath_1").textContent).toBe(
        "2 - 2",
      );
    });
  });

  it("ignores startingPosition if not provided", () => {
    const props = { ...defaultProps, animatingFromPosition: undefined };
    const screen = render(<DroneWithPaths {...props} />);
    expect(screen.getByTestId("position").textContent).toBe("1 - 2");
  });

  it("does not render drone if show drone is set to false", () => {
    const props = { ...defaultProps, showDrone: false };
    const screen = render(<DroneWithPaths {...props} />);
    expect(screen.queryByTestId("position")).not.toBeInTheDocument();
  });

  it("only renders remaining path if there is no tracking", async () => {
    const props = { ...defaultProps, tracking: null };
    const screen = render(<DroneWithPaths {...props} />);
    await waitFor(async () => {
      expect(screen.queryByTestId("coveredPath_0")).not.toBeInTheDocument();
      await expect(screen.getByTestId("remainingPath_0").textContent).toBe(
        "0 - -1",
      );
      await expect(screen.getByTestId("remainingPath_1").textContent).toBe(
        "2 - 2",
      );
    });
  });

  it("only drone at starting position path if tracking has no drone position", async () => {
    const props = { ...defaultProps };
    props.tracking.current_position = null;
    const screen = render(<DroneWithPaths {...props} />);
    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("-1 - 0");
    });
  });

  it("draws full path if its set to complete", async () => {
    const props = {
      ...defaultProps,
      animatingFromPosition: undefined,
      isComplete: true,
    };

    props.tracking.flight_path_coordinates = [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ];
    const screen = render(<DroneWithPaths {...props} />);
    await waitFor(async () => {
      await expect(screen.getByTestId("coveredPath_5").textContent).toBe(
        "2 - 2",
      );
    });
  });
});
