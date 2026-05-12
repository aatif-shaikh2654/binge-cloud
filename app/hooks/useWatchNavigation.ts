import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useWatchNavigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleWatchClick = () => {
    if (typeof window === "undefined") return;
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    sessionStorage.setItem("lastPage", currentPath);
  };

  const handleBack = (defaultFallback: string) => {
    if (typeof window === "undefined") {
      router.replace(defaultFallback);
      return;
    }

    const sessionLastPage = sessionStorage.getItem("lastPage");
    const urlLastPage = searchParams.get("lastPage");
    const lastPage = sessionLastPage || urlLastPage;

    if (lastPage) {
      sessionStorage.removeItem("lastPage");
      router.replace(lastPage);
    } else {
      router.replace(defaultFallback);
    }
  };

  return { handleWatchClick, handleBack };
};
