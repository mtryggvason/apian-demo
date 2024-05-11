
import { GoogleAuthProvider, signInWithPopup, getAuth, AuthProvider, } from "firebase/auth";
import  "./firebase";

const provider = new GoogleAuthProvider();

export const auth = getAuth();
// TODO add a provider as an argument to signin
export const signIn = (provided: AuthProvider) => {
    return signInWithPopup(auth, provider);
}; 

export const signOut = () => {
    auth.signOut();
}