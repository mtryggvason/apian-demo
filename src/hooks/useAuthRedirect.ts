import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthRedirect = (auth:any) => {
  const router = useRouter();
  useEffect(() => {
      auth.onAuthStateChanged(() => {
        if(auth.currentUser) {
          router.push('/map');
        } else {
            router.push('/');
        }
      });
    }, []);
}