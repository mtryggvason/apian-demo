import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import useSWR, { SWRConfiguration } from "swr";

interface AutheticatedSWRConfiguration extends SWRConfiguration {
  onInvalidSession?: () => void;
}

export function useAuthenticatedSWR<T>(
  key: [string] | null,
  fetcher: ((arg: [string, any]) => Promise<T>) | null,
  config: AutheticatedSWRConfiguration,
) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // If no callback is provided set window location to /
      // This is dones since next js redirect does not refresh server side components
      // E.g. the nav bar
      config.onInvalidSession ? config.onInvalidSession() : signOut();
    },
  });

  const swrKey = status === "loading" ? null : key;

  const data = useSWR(
    swrKey,
    async ([key]) => {
      if (fetcher) {
        return await fetcher([key, session?.access_token]);
      }
    },
    config,
  );
  return { ...data, isLoading: data.isLoading || status === "loading" };
}
