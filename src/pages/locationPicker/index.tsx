import { simpleCoordWithHeading } from "@/components/ARTracker";
import StyledButton from "@/components/buttons/StyledButton";
import { ApianMap } from "@/components/maps/ApianMap";
import { simpleCoord } from "@/lib/types/coordinates";
import mqtt from "mqtt";
import { useEffect, useRef, useState } from "react";
import { MapRef, Marker } from "react-map-gl";

const LocationsPicker = function () {
  const [userLocation, setUserLocation] = useState<simpleCoord | null>(null);
  const clientRef = useRef<any>(null);
  const mapRef = useRef<MapRef>(null);
  const [markerPosition, setMarkerPosition] =
    useState<simpleCoordWithHeading | null>(null);
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          if (mapRef.current) {
            mapRef.current.jumpTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 16,
            });
          }
        },
        (error) => {
          console.error("Error getting user's location:", error);
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  useEffect(() => {
    clientRef.current = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");
    clientRef.current.on("connect", () => {
      clientRef.current.subscribe("apian-drone-position");
    });

    clientRef.current.on("message", (topic: string, message: any) => {
      // message is Buffer
      console.log(message.toString());
    });
  }, []);

  useEffect(() => {
    if (markerPosition && clientRef.current) {
      clientRef.current.publish(
        "apian-drone-position",
        JSON.stringify(markerPosition),
      );
    }
  }, [markerPosition]);
  return (
    <div className="w-screen h-screen relative">
      <div className="absolute left-4 top-4 z-10">
        <StyledButton onClick={() => getUserLocation()}>
          Go to My Location
        </StyledButton>
        <br />
        <input
          onChange={(event) => {
            setMarkerPosition((p) => {
              return { ...p, altitude: parseInt(event.target.value) } as any;
            });
          }}
          placeholder="Drone Altitude Meters"
          type="number"
        />
      </div>
      <ApianMap
        ref={mapRef}
        onClick={(event) => {
          const coordinates = event.lngLat; // Get the coordinates of the click
          const lon = coordinates.lng; // Longitude
          const lat = coordinates.lat; // Latitud
          setMarkerPosition({ lat, lon, altitude: markerPosition?.altitude });
        }}
      >
        {markerPosition && (
          <Marker
            latitude={markerPosition.lat}
            longitude={markerPosition?.lon}
          ></Marker>
        )}
      </ApianMap>
      ;
    </div>
  );
};

export default LocationsPicker;
