import GoogleMapReact from 'google-map-react';
import { Point, Position, along, center, distance, lineString, point, points } from '@turf/turf';
import { auth } from '@/remote/authenticationService';
import HospitalMarker from './hospital_marker.svg';
import DroneMarker from './drone_marker.svg';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useEffect, useState } from 'react';
import { addPositions, getRouteLength, isDataBaseEmpty } from '@/remote/locationService';
import { getPosition } from '@/remote/locationService';
import { GeoPoint } from '@firebase/firestore';
import { useUpdatingMarkerLocation } from '@/hooks/useUpdatingMarkerLocation';

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





export default function Map({endpoints = LOCATIONS}) {
  const [didCreateRoute, setDidCreateRoute ]= useState(false);
  useAuthRedirect(auth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const centerPoint = center(points(endpoints.map(location => Object.values(location))));
  const movingMarkerLocation = useUpdatingMarkerLocation({
    retriveLocation:async function(index: number){ 
      const snapshot = await getPosition(index);
      return snapshot.docs.at(0)?.data().location as GeoPoint;
    },
    getRouteLength: async function() {
      return await getRouteLength();
    }
  });
  
  useEffect(() => {
    async function initRoute() {
      const locationsArray = endpoints.map(location => Object.values(location));
      setDidCreateRoute(await createPath(locationsArray));
    }
    initRoute();
  }, []);


  return (
    <div className={` h-screen w-screen`}>
      <GoogleMapReact
        center={geoJSONToGoogleMap(centerPoint.geometry)}
        defaultZoom={13}
        bootstrapURLKeys={{ key: '' +process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}}
      >
        {endpoints.map((location:any, index:number) => 
          <HospitalMarker
          key={index}
          lat={location.lat}
          lng={location.lng}
          width={50}
          style={{transform: 'translate(-50%, -50%)'}}

        />
        )}
        {didCreateRoute && 
          <DroneMarker
          lat={movingMarkerLocation.lat}
          lng={movingMarkerLocation.lng}
          width={50}
          style={{transform: 'translate(-50%, -50%)'}}
          />
        }
      </GoogleMapReact>
    </div>
  )
}
