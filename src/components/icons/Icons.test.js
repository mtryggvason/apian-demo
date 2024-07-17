import { describe, expect, it } from "@jest/globals";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import CheckboxIcon from "./CheckboxIcon";
import { SizeableConnector } from "./SizeableConnector";

describe("The CheckboxIcon", () => {
  it("renders enabled", () => {
    const { container } = render(<CheckboxIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders disabled", () => {
    const { container } = render(<CheckboxIcon isDisabled={true} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(
      container.getElementsByClassName("fill-apian-medium-grey"),
    ).toHaveLength(1);
  });
});

describe("The SizeableConnector", () => {
  it("renders with default height", () => {
    const { container } = render(<SizeableConnector />);
    const svg = container.querySelector("svg");
    const height = svg.getAttribute("height");
    expect(svg).toBeInTheDocument();
    expect(height).toBe("102");
  });

  it("renders with a custom height", () => {
    const { container } = render(<SizeableConnector lineHeight={80} />);
    const svg = container.querySelector("svg");
    const height = svg.getAttribute("height");
    expect(svg).toBeInTheDocument();
    expect(height).toBe("80");
  });
});
