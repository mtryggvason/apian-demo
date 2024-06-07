import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";

import {
  useSessionAuthenticated,
  useSessionOnUnauthenticated,
} from "@/lib/testHelpers/mocks";

import { useAuthenticatedSWR } from "./useAuthenticatedSWR";

const mockSignOut = jest.fn();

// Create a test component for useAuthenticatedSWR
const TestComponent = ({ fetcher = null, onInvalidSession = mockSignOut }) => {
  const { data, error, isLoading } = useAuthenticatedSWR(["mockKey"], fetcher, {
    onInvalidSession,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return <div>Data: {data}</div>;
};

describe("useAuthenticatedSWR", () => {
  it("should call fetcher with the correct arguments if there is a session", async () => {
    useSessionAuthenticated();
    const mockFetcher = jest.fn();
    const mockSession = { access_token: "mockKey" };

    render(<TestComponent fetcher={mockFetcher} />);

    await waitFor(async () => {
      expect(mockFetcher).toHaveBeenCalledWith([
        mockSession.access_token,
        "test_token",
      ]);
    });
  });

  it("should call onInvalidSession if the session is invalid", async () => {
    const mockFetcher = jest.fn();
    useSessionOnUnauthenticated();
    render(<TestComponent fetcher={mockFetcher} />);
    await waitFor(async () => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
