import type { NextApiRequest, NextApiResponse } from "next";
import { getMockFlightsResponse } from "@/utils/mockFlights";

// Proxies the Apian public flights API. The upstream API sends no CORS
// headers, so the browser can't call it directly.
const FLIGHTS_URL = "https://api.apian.aero/public/v1/flights/?page_size=10";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Mock mode: /api/flights?mock=vienna, or FLIGHTS_MOCK=vienna in .env.local
  const mockRoute =
    (typeof req.query.mock === "string" && req.query.mock) ||
    process.env.FLIGHTS_MOCK;
  if (mockRoute) {
    const mock = getMockFlightsResponse(mockRoute);
    if (!mock) {
      return res.status(400).json({ message: `Unknown mock: ${mockRoute}` });
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(mock);
  }

  try {
    const response = await fetch(FLIGHTS_URL, { cache: "no-store" });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: await response.text() });
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(await response.json());
  } catch (error) {
    console.error("Error fetching flights:", error);
    return res.status(502).json({ message: "Failed to fetch flights" });
  }
}
