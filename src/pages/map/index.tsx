import {
  Position,
  along,
  center,
  distance,
  lineString,
  point,
} from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { addPositions } from "@/remote/locationService";
import { useGLTF, useAnimations } from "@react-three/drei";

import Map, { MapRef } from "react-map-gl";
import { Canvas } from "react-three-map"; // if you are using MapBox
import { useValueTransition } from "@/hooks/useValueTransition";
import { useUpdatingMarkerLocation } from "@/hooks/useUpdatingMarkerLocation";

function geoJSONToGoogleMap(point: any): { lat: number; lng: number } {
  return { lat: point.coordinates[0], lng: point.coordinates[1] };
}

const LOCATIONS = [
  {
    lat: 51.51418339306122,
    lng: -0.09493263795189932,
  },
  {
    lat: 51.5032,
    lng: 0.0868,
  },
  {
    lat: 51.4992,
    lng: 0.1189,
  },
];

function createPath(inputPoints: Array<Position>) {
  const line = lineString(inputPoints);
  const totalDistance = distance(point(inputPoints[0]), point(inputPoints[1]));
  let currentDistance = 0;
  const outputPoints = [];
  while (currentDistance < totalDistance) {
    outputPoints.push(along(line, currentDistance));
    currentDistance += 0.05;
  }
  addPositions(outputPoints.map((feature) => feature.geometry));
  return outputPoints;
}

export default function Page({ endpoints = LOCATIONS }) {
  const [route, setRoute] = useState<any>([]);
  const map = useRef<MapRef>(null);
  const location = useUpdatingMarkerLocation(route);
  const lat = useValueTransition(location.lat, 1000);
  const lng = useValueTransition(location.lng, 1000);
  useEffect(() => {
    async function initRoute() {
      const locationsArray = endpoints.map((location) =>
        Object.values(location)
      ) as Array<Position>;
      setRoute(createPath(locationsArray));
    }
    initRoute();
  }, []);

  useEffect(() => {
    if (map.current && location) {
      const camera = map.current.getFreeCameraOptions();
      const cameraAltitude = 40000;

      map.current.jumpTo({
        center: [lat, lng],
        bearing: map.current.getBearing() + 0.5,
      });
    }
  }, [map, location, lat, lng]);
  return (
    <Map
      ref={map}
      antialias
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_KEY}
      initialViewState={{
        longitude: LOCATIONS[0].lng,
        latitude: LOCATIONS[0].lat,
        zoom: 16,
        pitch: 60,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/standard"
    >
      <Canvas frameloop="always" altitude={100} latitude={lng} longitude={lat}>
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <SpliceElement path="/scene.gltf" />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </Map>
  );
}

function SpliceElement({ path }: { path: string }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);

  return <primitive scale={2} args={[10, 10, 10]} object={scene} />;
}
