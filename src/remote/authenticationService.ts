
import { GoogleAuthProvider, signInWithPopup, getAuth, } from "firebase/auth";
import  "./firebase";

const provider = new GoogleAuthProvider();

export const auth = getAuth();
export const signIn = () =>{
    return signInWithPopup(auth, provider);

}; 

export const signOut = () => {
    auth.signOut();
}