import * as process from "process";

import { LocationDetail } from "@/lib/types/location";

const baseMapboxStaticImagesAPIURL = "https://api.mapbox.com/styles/v1/";
const theme = process.env.NEXT_PUBLIC_MAPBOX_THEME?.replace(
  "mapbox://styles/",
  "",
);
const zoomLevel = "12";

export const buildMapboxStaticImageUrl = (location: LocationDetail) => {
  const locationCoords = `${location.coordinates.lon},${location.coordinates.lat},${zoomLevel},0/`;

  return (
    baseMapboxStaticImagesAPIURL +
    theme +
    "/static/" +
    locationCoords +
    "410x138?attribution=false&logo=false&access_token=" +
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  );
};
