import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, useGLTF } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Euler, Group, MathUtils, Quaternion, Vector3 } from "three";
import { simpleCoord } from "@/lib/types/coordinates";
import { Drone } from "@/components/icons/Drone";
import {
  Vec3,
  altitudeAlongPath,
  buildPathPoints,
  progressAlongPath,
  toLocalPosition,
} from "@/utils/skyPath";

/** Vertical field of view of a phone's main camera held in portrait, roughly. */
const CAMERA_VERTICAL_FOV = 60;
const EYE_HEIGHT_M = 1.6;
const PATH_COLOR = "#1e7bff";

export type SkyRoute = {
  source: { name: string; coordinates: simpleCoord };
  destination: { name: string; coordinates: simpleCoord };
};

// --- Device orientation → camera rotation -----------------------------------
// Same maths as three.js's (since removed) DeviceOrientationControls. In this
// frame alpha = 0 means the top of the phone points north (-z).
const ZEE = new Vector3(0, 0, 1);
const BACK_CAMERA = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

const orientationToQuaternion = (
  target: Quaternion,
  alpha: number,
  beta: number,
  gamma: number,
  screenAngle: number,
) => {
  const euler = new Euler(beta, alpha, -gamma, "YXZ");
  target.setFromEuler(euler);
  target.multiply(BACK_CAMERA);
  target.multiply(new Quaternion().setFromAxisAngle(ZEE, -screenAngle));
};

/** How slowly the compass correction follows (seconds); higher = steadier. */
const COMPASS_SMOOTHING_S = 3;
/** Only correct from the compass while turning slower than this (deg/s). */
const MAX_TURN_SPEED_FOR_COMPASS = 15;
/** Compass readings further off than this are treated as glitches... */
const COMPASS_OUTLIER_DEG = 20;
/** ...unless they persist this long (seconds). */
const COMPASS_OUTLIER_PERSIST_S = 2;

const wrapDegrees = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

const getScreenAngle = () =>
  (typeof screen !== "undefined" && screen.orientation?.angle) ||
  (window as any).orientation ||
  0;

/** Rotates the R3F camera to match the phone, with north taken from the compass. */
const DeviceOrientationCamera = () => {
  const camera = useThree((state) => state.camera);
  const target = useRef(new Quaternion());
  const hasReading = useRef(false);
  // Degrees to add to alpha so it is relative to north.
  const alphaOffset = useRef<number | null>(null);
  const lastAlpha = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const outlierSeconds = useRef(0);

  useEffect(() => {
    // Android Chrome: this event's alpha is already relative to north.
    const useAbsoluteEvent = "ondeviceorientationabsolute" in window;
    const eventName = useAbsoluteEvent
      ? "deviceorientationabsolute"
      : "deviceorientation";

    const handle = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      if (alpha === null || beta === null || gamma === null) return;

      const now = performance.now();
      const dt =
        lastTime.current === null ? 0 : (now - lastTime.current) / 1000;
      const turnSpeed =
        lastAlpha.current === null || dt === 0
          ? 0
          : Math.abs(wrapDegrees(alpha - lastAlpha.current)) / dt;
      lastAlpha.current = alpha;
      lastTime.current = now;

      const compassHeading = (event as any).webkitCompassHeading;
      const compassAccuracy = (event as any).webkitCompassAccuracy;
      if (typeof compassHeading === "number" && compassAccuracy !== -1) {
        // iOS: alpha starts at an arbitrary direction, so it is aligned with
        // the compass. The gyro (alpha) is smooth and instant; the compass is
        // noisy and lags, so trust the gyro and only nudge the alignment
        // slowly, while the phone is held fairly still.
        const offset = wrapDegrees(360 - compassHeading - alpha);
        if (alphaOffset.current === null) {
          alphaOffset.current = offset;
        } else {
          const error = wrapDegrees(offset - alphaOffset.current);
          const holdingStill = turnSpeed < MAX_TURN_SPEED_FOR_COMPASS;
          // The compass is unreliable when the phone points steeply up/down.
          const reasonableTilt = beta > 30 && beta < 130;
          if (Math.abs(error) > COMPASS_OUTLIER_DEG) {
            outlierSeconds.current += dt;
          } else {
            outlierSeconds.current = 0;
          }
          // Ignore sudden compass jumps unless they persist (then it's real).
          const accept =
            Math.abs(error) <= COMPASS_OUTLIER_DEG ||
            outlierSeconds.current > COMPASS_OUTLIER_PERSIST_S;
          if (holdingStill && reasonableTilt && accept) {
            const k = 1 - Math.exp(-dt / COMPASS_SMOOTHING_S);
            alphaOffset.current += error * k;
          }
        }
      } else if (typeof compassHeading !== "number") {
        alphaOffset.current = 0;
      }
      if (alphaOffset.current === null) return;

      orientationToQuaternion(
        target.current,
        MathUtils.degToRad(alpha + alphaOffset.current),
        MathUtils.degToRad(beta),
        MathUtils.degToRad(gamma),
        MathUtils.degToRad(getScreenAngle()),
      );
      hasReading.current = true;
    };

    window.addEventListener(eventName, handle as EventListener);
    return () => window.removeEventListener(eventName, handle as EventListener);
  }, []);

  useFrame(() => {
    if (hasReading.current) camera.quaternion.slerp(target.current, 0.25);
  });

  return null;
};

// --- Scene ------------------------------------------------------------------

const formatDistance = (position: Vec3) => {
  const metres = Math.hypot(
    position[0],
    position[1] - EYE_HEIGHT_M,
    position[2],
  );
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)} km`
    : `${Math.round(metres)} m`;
};

const Label = ({ position, title }: { position: Vec3; title: string }) => (
  <Html position={position} center zIndexRange={[20, 0]}>
    <div className="whitespace-nowrap rounded-md bg-white/90 px-2 py-1 text-center text-xs font-bold text-[#1e7bff] shadow">
      {title}
      <div className="font-normal text-gray-700">
        {formatDistance(position)}
      </div>
    </div>
  </Html>
);

// --- Drone ------------------------------------------------------------------

/**
 * Drone model exported from Spline. This is the binary version without the
 * propeller animation: smaller to download, and playing that animation froze
 * the page.
 */
const DRONE_MODEL_PATH = "/scene.glb";
/** The model is about this wide in its own units. */
const DRONE_MODEL_WIDTH_UNITS = 130;
/**
 * A real drone would be a speck at a few hundred metres, so the model is
 * scaled with distance to always look about this wide: 1.5 × distance ≈ 74° (wider than the ~30° portrait view).
 */
const DRONE_APPARENT_SIZE = 1.5;

const DroneModel = () => {
  const { scene } = useGLTF(DRONE_MODEL_PATH);
  // Clone so this doesn't fight the map pages over the cached model.
  const model = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={model} />;
};

/** Flat icon shown while the 3D model downloads. */
const DroneIconMarker = () => (
  <Html center zIndexRange={[30, 20]}>
    <div className="rounded-full bg-white/90 p-1 shadow">
      <Drone />
    </div>
  </Html>
);

useGLTF.preload(DRONE_MODEL_PATH);

// --- Smooth drone movement ----------------------------------------------------
// The API only gives a position every poll (5 s), so between polls the drone
// is moved forward along the route at its estimated speed, every frame.

/** Stop predicting this long after the last position, until a new one arrives. */
const MAX_EXTRAPOLATION_S = 15;
/** Faster than this (m/s) between polls means a jump (e.g. a new flight), not flying. */
const MAX_PLAUSIBLE_SPEED_MS = 60;
/** How quickly the drawn drone catches up when a new position corrects it (s). */
const CATCH_UP_S = 0.5;

const lerpCoord = (a: simpleCoord, b: simpleCoord, t: number) => ({
  lat: a.lat + (b.lat - a.lat) * t,
  lon: a.lon + (b.lon - a.lon) * t,
});

type MovingDroneProps = {
  userLocation: simpleCoord;
  route: SkyRoute;
  position: simpleCoord;
  /** When `position` was measured (ISO time), used to predict from. */
  fixTime?: string;
};

const MovingDrone = ({
  userLocation,
  route,
  position,
  fixTime,
}: MovingDroneProps) => {
  const source = route.source.coordinates;
  const destination = route.destination.coordinates;
  const outer = useRef<Group>(null);
  const model = useRef<Group>(null);
  const label = useRef<HTMLDivElement>(null);
  // Progress along the route (0..1) at the last position, and when.
  const lastFix = useRef<{ t: number; timeMs: number } | null>(null);
  // Estimated speed, in route fractions per second.
  const speed = useRef(0);
  // Progress currently drawn; eases toward the prediction.
  const shownT = useRef<number | null>(null);

  const routeLengthM = useMemo(() => {
    const [x, , z] = toLocalPosition(source, destination);
    return Math.hypot(x, z);
  }, [source, destination]);

  // A new poll: update the speed estimate from the previous position.
  useEffect(() => {
    const t = progressAlongPath(source, destination, position);
    const parsed = fixTime ? Date.parse(fixTime) : NaN;
    const timeMs = Number.isNaN(parsed) ? Date.now() : parsed;
    const previous = lastFix.current;
    if (previous && timeMs === previous.timeMs) return; // same position again

    if (previous && timeMs > previous.timeMs) {
      const tPerSecond = (t - previous.t) / ((timeMs - previous.timeMs) / 1000);
      const metresPerSecond = tPerSecond * routeLengthM;
      if (metresPerSecond >= 0 && metresPerSecond <= MAX_PLAUSIBLE_SPEED_MS) {
        speed.current = tPerSecond;
      } else {
        // Went backwards or jumped: start again from here instead of gliding.
        speed.current = 0;
        shownT.current = t;
      }
    }
    lastFix.current = { t, timeMs };
  }, [position, fixTime, source, destination, routeLengthM]);

  useFrame((_, delta) => {
    const fix = lastFix.current;
    if (!fix || !outer.current) return;

    const ageS = Math.min(
      Math.max((Date.now() - fix.timeMs) / 1000, 0),
      MAX_EXTRAPOLATION_S,
    );
    const predictedT = Math.min(fix.t + speed.current * ageS, 1);
    shownT.current =
      shownT.current === null
        ? predictedT
        : shownT.current +
          (predictedT - shownT.current) * (1 - Math.exp(-delta / CATCH_UP_S));

    const t = shownT.current;
    const point = toLocalPosition(
      userLocation,
      lerpCoord(source, destination, t),
      altitudeAlongPath(t),
    );
    outer.current.position.set(...point);

    const distance = Math.hypot(point[0], point[1] - EYE_HEIGHT_M, point[2]);
    model.current?.scale.setScalar(
      (distance * DRONE_APPARENT_SIZE) / DRONE_MODEL_WIDTH_UNITS,
    );
    if (label.current) label.current.textContent = formatDistance(point);
  });

  const [dx, , dz] = toLocalPosition(source, destination);
  // Yaw that turns the model's -z (forward) toward the destination.
  const heading = Math.atan2(-dx, -dz);

  return (
    <group ref={outer}>
      <group ref={model} rotation={[0, heading, 0]}>
        <Suspense fallback={<DroneIconMarker />}>
          <DroneModel />
        </Suspense>
      </group>
      <Html center zIndexRange={[30, 20]}>
        {/* Pushed below the model so it doesn't cover it. */}
        <div
          ref={label}
          className="translate-y-20 whitespace-nowrap rounded bg-[#1e7bff] px-1 text-xs font-bold text-white"
        />
      </Html>
    </group>
  );
};

type SkyPathProps = {
  userLocation: simpleCoord;
  route: SkyRoute;
  /** Live drone position; drawn on the path at the matching altitude. */
  dronePosition?: simpleCoord | null;
  /** When `dronePosition` was measured (ISO time). */
  droneFixTime?: string;
};

const SkyPathScene = ({
  userLocation,
  route,
  dronePosition,
  droneFixTime,
}: SkyPathProps) => {
  const { source, destination } = route;
  const points = useMemo(
    () =>
      buildPathPoints(
        userLocation,
        source.coordinates,
        destination.coordinates,
      ),
    [userLocation, source.coordinates, destination.coordinates],
  );
  const sourcePosition = toLocalPosition(userLocation, source.coordinates);
  const destinationPosition = toLocalPosition(
    userLocation,
    destination.coordinates,
  );
  return (
    <>
      <DeviceOrientationCamera />
      <ambientLight intensity={1.5} />
      <directionalLight position={[100, 300, 100]} intensity={2.5} />
      <Line
        points={points}
        color={PATH_COLOR}
        lineWidth={6}
        transparent
        opacity={0.9}
      />
      <Label position={sourcePosition} title={source.name} />
      <Label position={destinationPosition} title={destination.name} />
      {dronePosition && (
        <MovingDrone
          userLocation={userLocation}
          route={route}
          position={dronePosition}
          fixTime={droneFixTime}
        />
      )}
    </>
  );
};

/** Full-screen transparent overlay that draws the flight path in the sky. */
export const SkyPath = (props: SkyPathProps) => (
  <Canvas
    className="!absolute inset-0 pointer-events-none"
    camera={{
      fov: CAMERA_VERTICAL_FOV,
      near: 0.5,
      far: 20_000,
      position: [0, EYE_HEIGHT_M, 0],
    }}
    gl={{ alpha: true }}
  >
    <SkyPathScene {...props} />
  </Canvas>
);

export default SkyPath;
