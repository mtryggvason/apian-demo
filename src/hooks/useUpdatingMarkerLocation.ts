import { Feature, Point, Properties } from "@turf/turf";
import { GeoPoint } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export const useUpdatingMarkerLocation = (route:  Array<Feature<Point, Properties>>) => {
  const index = useRef(0);
  const directionMultiplier = useRef(1);
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const updateLocation =  () =>  {
      const newLocation = route[index.current];
      if (!newLocation) return;
      setLocation({
        lat: newLocation.geometry.coordinates[1],
        lng: newLocation.geometry.coordinates[0],
      });
      // If we reached one endpoint we reverse
      if (index.current === route.length - 1  || (index.current === 0 && directionMultiplier.current < 0) ) {
        directionMultiplier.current = directionMultiplier.current * -1;
      }

      index.current = Math.max(index.current + directionMultiplier.current, 0);
      setTimeout(updateLocation, 1000);
    }
    if(route.length > 0) {
      updateLocation();      
    }
  }, [route]);

  return location;
}