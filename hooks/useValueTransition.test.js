import React from "react";
import { act, render, waitFor } from "@testing-library/react";

import { useValueTransition } from "./useValueTransition";

describe("useValueTransition", () => {
  // Helper function to render a component using the hook
  const TestComponent = ({ value, duration, easing }) => {
    const transitionedValue = useValueTransition({
      inputValue: value,
      duration,
      easing,
    });
    return <div data-testid="transitioned-value">{transitionedValue}</div>;
  };

  it("should transition to the new value", async () => {
    const { getByTestId, rerender } = render(
      <TestComponent value={0} duration={500} />,
    );

    expect(getByTestId("transitioned-value").textContent).toBe("0");

    await waitFor(async () => {
      expect(getByTestId("transitioned-value").textContent).toBe("0");
    });

    rerender(<TestComponent value={100} duration={500} />);
    // Value is somewhere between 0 and 100
    expect(getByTestId("transitioned-value").textContent).not.toBe("0");
    expect(getByTestId("transitioned-value").textContent).not.toBe("100");

    await waitFor(async () => {
      await expect(getByTestId("transitioned-value").textContent).toBe("100");
    });
  });

  it("should use custom easing function", async () => {
    const customEasing = (timePassed, totalDuration) => 0;
    const { getByTestId, rerender } = render(
      <TestComponent value={0} duration={500} easing={customEasing} />,
    );

    expect(getByTestId("transitioned-value").textContent).toBe("0");

    rerender(
      <TestComponent value={100} duration={500} easing={customEasing} />,
    );

    // Since our custom easing always returns 0 we would expect the value to be 0
    expect(getByTestId("transitioned-value").textContent).toBe("0");
  });

  it("is called with a default value for duration", () => {
    const { getByTestId, rerender } = render(<TestComponent value={0} />);
    expect(getByTestId("transitioned-value").textContent).toBe("0");
  });
});
