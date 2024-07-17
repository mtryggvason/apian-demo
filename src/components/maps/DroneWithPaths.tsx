"use client";
import { Canvas } from "react-three-map"; // if you are using MapBox
import { useGLTF, useAnimations } from "@react-three/drei";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl";
import { bearing, lineSlice, lineString, rhumbBearing } from "@turf/turf";
import Lottie from "lottie-react";

import MarkerAnimation from "@/components/animations/drone-marker.json";
import { useValueTransition } from "@/hooks/useValueTransition";
import { transferTrackingRefreshIntervalMilliseconds } from "@/lib/constants/apiRefreshIntervals";
import { APIAN_MEDIUM_GREY, APIAN_NHS_BLUE } from "@/lib/constants/colors";
import { simpleCoordToArray, simpleCoordToPoint } from "@/lib/mapHelpers";
import { simpleCoord } from "@/lib/types/coordinates";
import { Tracking } from "@/lib/types/transfer";
import { useInterval } from "usehooks-ts";
import { MercatorCoordinate } from "mapbox-gl";

interface DroneWithPathsProps {
  routeStartPoint: simpleCoord;
  routeEndPoint: simpleCoord;
  tracking?: Tracking;
  animatingFromPosition?: simpleCoord;
  animationDuration?: number;
  showDrone?: boolean;
  isComplete?: boolean;
  is3D?: boolean;
}

export default function DroneWithPaths({
  tracking,
  routeStartPoint,
  routeEndPoint,
  animatingFromPosition,
  showDrone,
  is3D,
  isComplete,
  animationDuration = transferTrackingRefreshIntervalMilliseconds,
}: DroneWithPathsProps) {
  const [initialAnimation, setInitialAnimation] = useState(
    animatingFromPosition !== undefined && showDrone
  );
  const map = useMap();

  // We set the animation to false after first render to create a sense of movement
  useEffect(() => {
    setInitialAnimation(false);
  }, []);

  const dronePosition = tracking?.current_position
    ? tracking.current_position
    : routeStartPoint;

  const lat = useValueTransition({
    inputValue: initialAnimation
      ? animatingFromPosition?.lat!
      : dronePosition.lat,
    duration: animationDuration,
  });

  const lon = useValueTransition({
    inputValue: initialAnimation
      ? animatingFromPosition?.lon!
      : dronePosition.lon,
    duration: animationDuration,
  });

  const rotation =
    rhumbBearing(
      simpleCoordToPoint({ lat, lon }),
      simpleCoordToPoint({ lat: dronePosition.lat, lon: dronePosition.lon })
    ) - map.current!.getBearing();

  useEffect(() => {
    if (map.current && location && is3D) {
      const camera = map.current.getFreeCameraOptions();
      const cameraAltitude = 1500;

      // set the position and altitude of the camera
      camera.position = MercatorCoordinate.fromLngLat(
        {
          lng: lon,
          lat,
        },
        cameraAltitude
      );

      camera.lookAtPoint({
        lng: lon,
        lat,
      });

      map.current.setFreeCameraOptions(camera);
    }
  }, [map, location, lat, lon, is3D]);

  const fallbackRotation = bearing(
    simpleCoordToPoint({ lat, lon }),
    simpleCoordToPoint(routeEndPoint)
  );

  const flightPath = tracking?.flight_path_coordinates;

  // Use lineSlice to make sure that the coveredPath never goes further than our drone
  const coveredPathEndpoint = isComplete ? routeEndPoint : { lat, lon };
  const coveredPath = flightPath?.length
    ? lineSlice(
        simpleCoordToPoint(routeStartPoint),
        simpleCoordToPoint(coveredPathEndpoint),
        lineString([simpleCoordToArray(routeStartPoint), ...flightPath])
      )
    : null;

  const remainingPath = lineString([
    simpleCoordToArray({ lat, lon }),
    simpleCoordToArray(routeEndPoint),
  ]);

  return (
    <>
      {coveredPath && (
        <Source id="coveredPath" type="geojson" data={coveredPath}>
          <Layer
            id="coveredPath"
            type="line"
            paint={{
              "line-color": APIAN_NHS_BLUE,
              "line-width": 4,
            }}
          />
        </Source>
      )}

      <Source type="geojson" id="remainingPath" data={remainingPath}>
        <Layer
          beforeId={coveredPath ? "coveredPath" : undefined}
          id="remainingPath"
          type="line"
          paint={{
            "line-width": 4,
            "line-color": APIAN_MEDIUM_GREY,
          }}
        />
      </Source>

      {dronePosition && showDrone && (
        <>
          {is3D ? (
            <Canvas
              frameloop="always"
              altitude={100}
              latitude={lat}
              longitude={lon}
            >
              <pointLight position={[10, 10, 10]} />
              <mesh>
                <Suspense>
                  <SpliceElement path="/scene.gltf" />
                </Suspense>
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </Canvas>
          ) : (
            <Marker
              latitude={lat}
              longitude={lon}
              rotation={rotation !== 0 ? rotation : fallbackRotation}
            >
              <Lottie
                className="rotate-[-26deg]"
                animationData={MarkerAnimation}
              />
            </Marker>
          )}
        </>
      )}
    </>
  );
}

function SpliceElement({ path }: { path: string }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  return <primitive scale={4} args={[10, 10, 10]} object={scene} />;
}
