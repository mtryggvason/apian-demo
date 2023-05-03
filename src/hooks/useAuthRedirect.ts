import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthRedirect = (auth) => {
  const router = useRouter();
  useEffect(() => {
      auth.onAuthStateChanged(() => {
        if(auth.currentUser) {
          router.push('/map');
        } else {
            router.push('/');
        }
      });
    }, [router]);
}