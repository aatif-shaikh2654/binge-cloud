"use client";

import { usePathname, useRouter } from "next/navigation";

export const useWatchNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleWatchClick = () => {
    if (typeof window === "undefined") return;
    const search = window.location.search;
    const currentPath = `${pathname}${search}`;
    sessionStorage.setItem("lastPage", currentPath);
  };

  const handleBack = (defaultFallback: string) => {
    if (typeof window === "undefined") {
      router.replace(defaultFallback);
      return;
    }

    const sessionLastPage = sessionStorage.getItem("lastPage");
    const lastPage = sessionLastPage;

    if (lastPage) {
      sessionStorage.removeItem("lastPage");
      window.location.replace(lastPage);
    } else {
      window.location.replace(defaultFallback);
    }
  };

  return { handleWatchClick, handleBack };
};
