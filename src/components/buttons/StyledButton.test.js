import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import StyledButton from "./StyledButton";

describe("The StyledButton component", () => {
  it("renders on screen", () => {
    render(<StyledButton text={"Test"} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  it("calls action function", () => {
    const mockCallback = jest.fn();
    render(<StyledButton text={"Test"} action={mockCallback} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(mockCallback).toHaveBeenCalled();
  });
});
