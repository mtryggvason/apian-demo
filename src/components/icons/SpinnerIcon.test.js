import { describe, expect, it } from "@jest/globals";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import SpinnerIcon from "./SpinnerIcon";

describe("SpinnerIcon component", () => {
  it("renders on the screen", () => {
    const { container } = render(<SpinnerIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
  });
});
