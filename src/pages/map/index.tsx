

import { Point, Position, along, center, distance, lineString, point, points } from '@turf/turf';
import { useEffect, useRef, useState } from 'react';
import { addPositions, getRouteLength, isDataBaseEmpty } from '@/remote/locationService';
import { getPosition } from '@/remote/locationService';
import { GeoPoint } from '@firebase/firestore';
import { useUpdatingMarkerLocation } from '@/hooks/useUpdatingMarkerLocation';
import { useGLTF, useAnimations } from '@react-three/drei';

import Map, { Marker } from 'react-map-gl';
import { Canvas } from "react-three-map" // if you are using MapBox
import { useFrame, useThree } from '@react-three/fiber'
import SplineLoader from '@splinetool/loader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function geoJSONToGoogleMap(point: Point): {lat:number, lng: number} {
  return { lat: point.coordinates[0], lng: point.coordinates[1]};
}

const LOCATIONS = [
  {
    lat: 51.5032,
    lng: 0.0868
  },
  {
    lat: 51.4992,
    lng: 0.1189
  },
  // EYE OF LONDON
  {
    lat: 51.51418339306122,
    lng: -0.09493263795189932,
  }
]


async function createPath(inputPoints: Array<Position>, ) {
  const line = lineString(inputPoints);
  const totalDistance = distance(point(inputPoints[0]), point(inputPoints[1]));
  let currentDistance = 0;
  const outputPoints = [];
  while(currentDistance < totalDistance) {
    outputPoints.push(along(line, currentDistance));
    currentDistance += 0.05; 
  }
  if (await isDataBaseEmpty()) {
   await addPositions(outputPoints.map(feature => feature.geometry));
  }
  return true;
}

export default function Page({endpoints = LOCATIONS}) {
  const [didCreateRoute, setDidCreateRoute ]= useState(false);

  
  useEffect(() => {
    async function initRoute() {
      const locationsArray = endpoints.map(location => Object.values(location));
      setDidCreateRoute(await createPath(locationsArray));
    }
    initRoute();
  }, []);


  return (
  <Map
  antialias
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_KEY}
      initialViewState={{
        longitude: LOCATIONS[2].lng,
        latitude: LOCATIONS[2].lat,
        zoom: 16,
        pitch: 60
      }}
      style={{width: "100vw", height: "100vh"}}
      
      mapStyle="mapbox://styles/mapbox/standard"
    >
   <Canvas frameloop='always' altitude={100} latitude={LOCATIONS[2].lat} longitude={LOCATIONS[2].lng}>
    <pointLight position={[10, 10, 10]} />
        <mesh>
          <SpliceElement path="/scene.gltf" />
          <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>

      </Map>
  )
}



function SpliceElement({ path }: { path: string }) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);
  useEffect(() => {
    if (actions && actions.propellerRotation) {
      actions.RotationAnimation.play();
    }
  }, [actions]);

  useFrame((state, delta) => {
    mixer.update(delta)
  })

  return <primitive scale={2} args={[10, 10, 10]} object={scene} />;
}