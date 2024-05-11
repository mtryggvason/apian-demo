import { Auth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthRedirect = (auth:Auth) => {
  const router = useRouter();
  useEffect(() => {
      auth.onAuthStateChanged(() => {
        if(auth.currentUser) {
          router.push('/map');
        } else {
          router.push('/');
        }
      });
    }, [auth]);
}