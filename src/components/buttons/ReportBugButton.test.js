import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { PROFILE_REPORT_BUG_BUTTON_TXT } from "@/lib/constants/pageTextConstants";

import "@testing-library/jest-dom";

import ReportBugButton from "./ReportBugButton";

describe("The ReportBugButton", () => {
  it("renders correctly with label and svg", () => {
    const { container } = render(<ReportBugButton />);

    const button = screen.getByText(PROFILE_REPORT_BUG_BUTTON_TXT);
    expect(button).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
