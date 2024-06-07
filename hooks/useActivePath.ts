import { usePathname } from "next/navigation";

export function useActivePath(path: string): boolean {
  const pathname = usePathname();

  if (!pathname) {
    return false;
  }

  return pathname.toLowerCase().includes(path.toLowerCase());
}
