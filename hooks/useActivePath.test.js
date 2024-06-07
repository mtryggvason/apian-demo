import { describe, expect, it } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { usePathname } from "next/navigation";

import "@testing-library/jest-dom";

import { useActivePath } from "./useActivePath";

jest.mock("next/navigation");

describe("useActivePath", () => {
  it("returns false when pathname is falsy", () => {
    usePathname.mockReturnValueOnce("");

    const result = useActivePath("/example");

    expect(result).toBe(false);
  });

  it("returns true when pathname includes the specified path (case insensitive)", () => {
    usePathname.mockReturnValueOnce("/example/path");

    const result = useActivePath("/example/");

    expect(result).toBe(true);
  });

  it("returns false when pathname does not include the specified path", () => {
    usePathname.mockReturnValueOnce("/another/path");

    const result = useActivePath("/example/");

    expect(result).toBe(false);
  });
});
