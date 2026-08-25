import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const isIOS = typeof window !== "undefined"
    ? /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    : false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed / standalone
    const checkStandalone = () => {
      const nav = window.navigator as Navigator & { standalone?: boolean };
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also listen to appinstalled event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferred prompt, it can only be used once
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === "accepted";
  };

  return {
    isInstallable,
    isStandalone,
    isIOS,
    install,
  };
}
