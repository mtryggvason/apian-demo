// src/Arrow.js
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { calculateBearingAndElevation, isTargetInView } from "@/utils/geoUtils";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

export function Arrow({ rotation, isInView }: any) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={rotation}>
        {/* Smaller Arrow Shaft */}
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />{" "}
        {/* Reduced the radius and height */}
        <meshStandardMaterial color={isInView ? "blue" : "red"} />
        {/* Smaller Arrowhead */}
        <mesh position={[0, 1.5, 0]}>
          {/* Adjusted position for the smaller shaft */}
          <coneGeometry args={[0.3, 0.75, 32]} />{" "}
          {/* Reduced the radius and height */}
          <meshStandardMaterial color={isInView ? "blue" : "red"} />
        </mesh>
      </mesh>
    </>
  );
}

export default Arrow;
