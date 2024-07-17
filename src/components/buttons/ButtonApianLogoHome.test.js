import React from "react";
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import ButtonApianLogoHome from "./ButtonApianLogoHome";

describe("ButtonApianLogoHome", () => {
  it("renders the Apian logo with a link to the homepage", () => {
    render(<ButtonApianLogoHome />);

    const logoLink = screen.getByLabelText("Go to homepage");
    const logoImage = screen.getByAltText("Apian logo");

    expect(logoLink).toBeInTheDocument();
    expect(logoImage).toBeInTheDocument();
    expect(logoLink.getAttribute("href")).toBe("/"); // Assuming the homepage link is "/"
  });
});
