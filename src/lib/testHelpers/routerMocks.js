import { useRouter as mockRouter } from "next-router-mock";
let searchParams = {};
let code = "100-200";
export const useRouter = () => {
  return { ...mockRouter(), refresh: () => jest.fn() };
};

export function setSearchParams(value) {
  searchParams = value;
}

export function setCodeParams(value) {
  code = value;
}
export function setPathName(path) {
  pathname = path;
}
export const mockRedirect = jest.fn();

jest.mock("next/navigation", () => {
  const usePathname = () => {
    const router = useRouter();
    return router.pathname;
  };

  const useSearchParams = () => {
    return new URLSearchParams(searchParams);
  };
  const useParams = () => {
    return { code: code };
  };

  const redirect = mockRedirect;
  const refresh = mockRedirect;
  const replace = jest.fn();

  return {
    useRouter,
    usePathname,
    useSearchParams,
    useParams,
    redirect,
    refresh,
    replace,
  };
});
