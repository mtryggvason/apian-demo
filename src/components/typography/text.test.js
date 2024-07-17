import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import Text from "./Text";

describe.each([
  [
    "renders default text",
    { children: "Hello, World!" },
    ["font-inter", "text-xs", "leading-[14px]", "text-black"],
  ],
  [
    "applies default variants if no props are provided",
    { children: "Custom Text" },
    ["font-inter", "text-xs", "leading-[14px]", "text-black"],
  ],
  [
    "applies custom textSize and textColor variants",
    { textSize: "h2", textColor: "red", children: "Custom Text" },
    ["font-poppins", "text-lg", "font-normal", "text-apian-red"],
  ],
  [
    "applies custom class names in addition to variants",
    {
      className: "custom-class",
      textSize: "h2Bold",
      textColor: "darkGrey",
      children: "Custom Text",
    },
    [
      "font-poppins",
      "text-lg",
      "font-semibold",
      "text-apian-dark-grey",
      "custom-class",
    ],
  ],
  [
    "renders with custom tag",
    { tag: "h1", children: "Heading 1" },
    undefined,
    "H1",
  ],
  [
    "handles user events",
    { onClick: jest.fn(), children: "Click me" },
    undefined,
    undefined,
    "click",
  ],
])(
  "Text Component - %s",
  (description, props, expectedClasses, expectedTagName, expectedEvent) => {
    it(description, () => {
      render(<Text {...props} />);
      const textElement = screen.getByText(props.children || "");

      if (expectedClasses) {
        expectedClasses.forEach((className) => {
          expect(textElement).toHaveClass(className);
        });
      }

      if (expectedTagName) {
        expect(textElement.tagName).toBe(expectedTagName);
      }

      if (expectedEvent) {
        fireEvent[expectedEvent](textElement);
        expect(props.onClick).toHaveBeenCalled();
      }
    });
  },
);
