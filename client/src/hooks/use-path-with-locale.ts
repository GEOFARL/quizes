import { usePathname } from "next/navigation";
import { useCallback } from "react";

const usePathWithLocale = (): ((path: string) => string) => {
  const pathname = usePathname();

  const determinePath = useCallback(
    (path: string): string => {
      return `/${pathname.split("/")[1]}${path}`;
    },
    [pathname]
  );

  return determinePath;
};

export default usePathWithLocale;
