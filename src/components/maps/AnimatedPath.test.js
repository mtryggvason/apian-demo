import React from "react";
import { render, waitFor } from "@testing-library/react";

import "@/lib/testHelpers/mapMocks";
import "@testing-library/jest-dom";

import { AnimatedPath } from "./AnimatedPath"; // adjust the import path as necessary

describe("AnimatedMarker", () => {
  const defaultProps = {
    startingPosition: { lat: 1, lon: 1 },
    endPosition: { lat: 10, lon: 10 },
    animationDuration: 100,
  };

  it("transitions from starting position to end position", async () => {
    const screen = render(<AnimatedPath {...defaultProps} />);

    // Poisition is somewhere between 11 and 1010
    expect(screen.queryByText("10 - 10")).not.toBeInTheDocument();

    await waitFor(async () => {
      await expect(screen.getByTestId("data_0").textContent).toBe("1 - 1");

      await expect(screen.getByTestId("data_1").textContent).toBe("10 - 10");
    });

    const newProps = {
      startingPosition: { lat: 1, lon: 1 },
      endPosition: { lat: 15, lon: 15 },
      animationDuration: 100,
    };
    screen.rerender(<AnimatedPath {...newProps} />);
    await waitFor(async () => {
      await expect(screen.getByTestId("data_1").textContent).toBe("15 - 15");
    });
  });
});
