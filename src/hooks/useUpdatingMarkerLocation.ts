import { GeoPoint } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export const useUpdatingMarkerLocation = ({retriveLocation, getRouteLength}: {retriveLocation: Function, getRouteLength: Function}) => {
  const index = useRef(0);
  const routeLength = useRef(0);
  const directionMultiplier = useRef(1);
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const updateRouteLength = async () => {
      routeLength.current = await getRouteLength();
    }
    const updateLocation = async () =>  {
      const newLocation = await retriveLocation(index.current) as GeoPoint;
      if (!newLocation) return;
      setLocation({
        lat: newLocation.latitude,
        lng: newLocation.longitude
      });
      // If we reached one endpoint we reverse
      if (index.current === routeLength.current - 1  || (index.current === 0 && directionMultiplier.current < 0) ) {
        directionMultiplier.current = directionMultiplier.current * -1;
      }

      index.current = Math.max(index.current + directionMultiplier.current, 0);
      setTimeout(updateLocation, 1000);
    }
    updateRouteLength();
    updateLocation();
  }, []);

  return location;
}