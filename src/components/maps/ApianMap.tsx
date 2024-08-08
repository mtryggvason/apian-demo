import React, {
  forwardRef,
  HTMLProps,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Skeleton from "react-loading-skeleton";
import { Map, MapProps, MapRef } from "react-map-gl";

import MinusIconButton from "@/components/buttons/icon_buttons/MinusIconButton";
import PlusIconButton from "@/components/buttons/icon_buttons/PlusIconButton";
import { APIAN_OFFICE_LOCATION } from "@/lib/constants/locationConstants";

import "react-loading-skeleton/dist/skeleton.css";

export interface ApianMapProps extends MapProps {
  showControls?: boolean;
  controlsClassName?: HTMLProps<HTMLElement>["className"];
}

const MapWrapper = (
  {
    initialViewState = {
      longitude: APIAN_OFFICE_LOCATION.lon,
      latitude: APIAN_OFFICE_LOCATION.lat,
      zoom: APIAN_OFFICE_LOCATION.zoom,
    },
    ...props
  }: ApianMapProps,
  ref: React.Ref<MapRef>,
) => {
  const mapRef = useRef<MapRef>(null);
  const [mapDidload, setMapDidLoad] = useState(false);
  useImperativeHandle(ref, () => mapRef.current!);

  const onMapLoad = useCallback(() => {
    mapRef.current?.resize();
    setMapDidLoad(true);
  }, []);

  const defaultTheme =
    process.env.NEXT_PUBLIC_MAPBOX_THEME ?? "mapbox://styles/mapbox/standard";
  return (
    <>
      {!mapDidload && (
        <Skeleton
          count={1}
          containerTestId="loading-skeleton"
          className="relative block h-full w-full"
          containerClassName={
            "absolute h-full w-full overflow-hidden rounded-lg"
          }
          height="100%"
        />
      )}
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_KEY}
        mapStyle={props.mapStyle ?? defaultTheme}
        {...props}
        onLoad={onMapLoad}
      >
        {props.children}
      </Map>
      {props.showControls && (
        <div
          className={
            props.controlsClassName
              ? props.controlsClassName
              : "absolute bottom-[15px] right-[15px] z-10 space-y-[15px]"
          }
        >
          <PlusIconButton
            size="iconMedium"
            data-testid="zoom-in"
            action={() => {
              mapRef.current?.zoomIn();
            }}
          />

          <MinusIconButton
            size="iconMedium"
            data-testid="zoom-out"
            action={() => {
              mapRef.current?.zoomOut();
            }}
          />
        </div>
      )}
    </>
  );
};

export const ApianMap = forwardRef(MapWrapper);
