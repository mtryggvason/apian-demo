import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import SlidePanel from "./SlidePanel";

describe("SlidePanel", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  test("renders correctly when open", async () => {
    render(
      <SlidePanel isOpen={true} onClose={onClose}>
        <div>Panel Content</div>
      </SlidePanel>,
    );

    await waitFor(() => {
      expect(screen.getByText("Panel Content")).toBeInTheDocument();
    });
  });

  test("does not render when closed", () => {
    const { queryByText } = render(
      <SlidePanel isOpen={false} onClose={onClose}>
        <div>Panel Content</div>
      </SlidePanel>,
    );

    expect(queryByText("Panel Content")).not.toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", async () => {
    render(
      <SlidePanel isOpen={true} onClose={onClose}>
        <div>Panel Content</div>
      </SlidePanel>,
    );

    const closeButton = screen.getByTestId("close-panel-button");
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test("calls onClose when clicking outside the panel", async () => {
    render(
      <SlidePanel isOpen={true} onClose={onClose}>
        <div>Panel Content</div>
      </SlidePanel>,
    );

    fireEvent.click(document.body);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call onClose when clicking inside the panel", () => {
    render(
      <SlidePanel isOpen={true} onClose={onClose}>
        <div>Panel Content</div>
      </SlidePanel>,
    );

    const panelContent = screen.getByText("Panel Content");
    fireEvent.click(panelContent);

    expect(onClose).not.toHaveBeenCalled();
  });
});
