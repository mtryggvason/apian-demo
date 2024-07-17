import React from "react";
import { render, waitFor } from "@testing-library/react";

import "@/lib/testHelpers/mapMocks";
import "@testing-library/jest-dom";

import { AnimatedMarker } from "./AnimatedMarker"; // adjust the import path as necessary

describe("AnimatedMarker", () => {
  const defaultProps = {
    latitude: 1,
    longitude: 1,
    animationDuration: 100,
    startingPosition: { lat: 10, lon: 10 },
  };

  it("uses the starting latitude and longitude if provided for initial render", async () => {
    const screen = render(<AnimatedMarker {...defaultProps} />);

    // Poisition is somewhere between 10 and 1
    expect(screen.queryByText("1 - 1")).not.toBeInTheDocument();

    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("1 - 1");
    });
    const newProps = {
      latitude: 15,
      longitude: 15,
      animationDuration: 100,
      startingPosition: { lat: 10, lon: 10 },
    };

    screen.rerender(<AnimatedMarker {...newProps} />);
    await waitFor(async () => {
      await expect(screen.getByTestId("position").textContent).toBe("15 - 15");
    });
  });

  it("sets ignores startingPosition if not provided", () => {
    const props = {
      latitude: 15,
      longitude: 15,
      animationDuration: 100,
    };

    const screen = render(<AnimatedMarker {...props} />);
    expect(screen.getByTestId("position").textContent).toBe("15 - 15");
  });
});
