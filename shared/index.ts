// Shared types
export * from "./types/common";

// Shared lib
export * from "./lib/utils";
export * from "./lib/db";
export * from "./lib/api-handler";
export * from "./lib/action-wrapper";
export { default as axiosInstance } from "./lib/axios";

// Shared hooks
export * from "./hooks/useDebounce";
export * from "./hooks/usePWAInstall";

// Shared providers
export { default as QueryProvider } from "./providers/QueryProvider";
export { AuthProvider, useAuth } from "./providers/AuthProvider";

// Shared Layout Components
export { default as Header } from "./components/layout/Header";
export { default as Footer } from "./components/layout/Footer";
export { default as Sidebar } from "./components/layout/Sidebar";
export { default as PageHeader } from "./components/layout/PageHeader";

// Shared Feedback Components
export { default as BravePrompt } from "./components/feedback/BravePrompt";
export { default as DisableInspect } from "./components/feedback/DisableInspect";
export { default as ZoomableImage } from "./components/feedback/ZoomableImage";

// Shared Slider Primitives
export { default as BaseSwiperSlider } from "./components/sliders/BaseSwiperSlider";
export { SliderSkeleton } from "./components/sliders/SliderSkeleton";
export { default as StreamingPlatformsSkeleton } from "./components/sliders/StreamingPlatformsSkeleton";
