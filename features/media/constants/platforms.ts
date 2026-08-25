export interface Platform {
  id: string;
  name: string;
  slug: string;
  logoPath: string;
  bgClass: string;
  description: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "8",
    name: "Netflix",
    slug: "netflix",
    logoPath: "/platforms/netflix.svg",
    bgClass: "bg-black border-red-600/10 hover:border-red-600/30 hover:shadow-red-950/20",
    description: "Originals & Blockbusters",
  },
  {
    id: "9",
    name: "Prime Video",
    slug: "prime-video",
    logoPath: "/platforms/prime.svg",
    bgClass: "bg-[#0f172a] border-sky-500/10 hover:border-sky-500/30 hover:shadow-sky-950/20",
    description: "Movies & Popular TV",
  },
  {
    id: "337",
    name: "Disney+",
    slug: "disney-plus",
    logoPath: "/platforms/disney.svg",
    bgClass: "bg-[#091026] border-blue-500/10 hover:border-blue-500/30 hover:shadow-blue-950/20",
    description: "Family & Animation",
  },
  {
    id: "350",
    name: "Apple TV+",
    slug: "apple-tv",
    logoPath: "/platforms/apple.svg",
    bgClass: "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-300/20",
    description: "Premium Originals",
  },
  {
    id: "1899",
    name: "Max",
    slug: "max",
    logoPath: "/platforms/max.svg",
    bgClass: "bg-[#000d29] border-indigo-500/10 hover:border-indigo-500/30 hover:shadow-indigo-950/20",
    description: "HBO & Warner Bros.",
  },
  {
    id: "15",
    name: "Hulu",
    slug: "hulu",
    logoPath: "/platforms/hulu.svg",
    bgClass: "bg-[#0b0c0e] border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-emerald-950/20",
    description: "Next-Day TV & Movies",
  },
];
