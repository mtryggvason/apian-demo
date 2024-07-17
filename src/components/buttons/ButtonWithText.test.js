import React from "react";
import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import ButtonWithText from "./ButtonWithText";

describe("ButtonWithText Component", () => {
  it("renders button with text", () => {
    render(<ButtonWithText buttonText="Click me" />);
    const buttonElement = screen.getByText("Click me");
    expect(buttonElement).toBeInTheDocument();
  });

  it("executes action when clicked", () => {
    const mockAction = jest.fn();
    render(<ButtonWithText buttonText="Click me" action={mockAction} />);
    const buttonElement = screen.getByText("Click me");
    fireEvent.click(buttonElement);
    expect(mockAction).toHaveBeenCalled();
  });

  it("applies buttonSize, buttonColor, textColor and textSize variants", () => {
    render(
      <ButtonWithText
        buttonText="Styled Button"
        buttonSize="full"
        buttonColor="white"
        textSize="body"
        textColor="softBlack"
      />,
    );
    const buttonElement = screen.getByText("Styled Button");
    expect(buttonElement).toHaveClass(
      "w-full",
      "bg-white",
      "text-apian-soft-black",
      "textVariant",
      "font-inter",
      "text-xs",
    );
  });

  it("applies default variants when no props are provided", () => {
    render(
      <ButtonWithText
        buttonText="Click me"
        textSize={undefined}
        textColor={undefined}
        buttonSize={undefined}
        buttonColor={undefined}
      />,
    );
    const buttonElement = screen.getByText("Click me");

    expect(buttonElement).toHaveClass(
      "w-full",
      "bg-white",
      "text-black",
      "font-inter",
      "text-xs",
      "leading-[14px]",
    );
  });
});
