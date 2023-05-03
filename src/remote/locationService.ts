import { Point } from "@turf/helpers";

import { GeoPoint, collection, doc, getCountFromServer, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { app } from "./firebase";


const COLLECTION_NAME = 'locations'



// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function pointToGeoPoint(point: Point): GeoPoint {
  return new GeoPoint(point.coordinates[0], point.coordinates[1]);
}
  
export const isDataBaseEmpty = async function() {
  const querySnapshot = await getPosition(0);
  return querySnapshot.empty;
}

export const addPositions = async function addPositions(points: Array<Point>) {
  try {
    points.forEach((point, index) => {
          setDoc(doc(db, COLLECTION_NAME, index.toString()), {
          index: index,
          location:pointToGeoPoint(point)
        });
      });
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}

export const getPosition = async function(index: number, collectionName = COLLECTION_NAME) {
  const ref = collection(db, collectionName);
  const q = query(ref, where("index", "==", index));
  return await getDocs(q);
}

export const getRouteLength = async function(collectionName = COLLECTION_NAME) {
  const ref = collection(db, collectionName);
  try {
    const snapshot = await getCountFromServer(ref);
    return snapshot.data().count;
  } catch (e) {
    console.error("Error getting route length document: ", e);
  }
}