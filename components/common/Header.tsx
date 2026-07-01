"use client";

import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="absolute top-0 right-0 z-[110] px-8 py-6 flex items-center justify-end w-full pointer-events-none">
      <Link
        href="/"
        className="pointer-events-auto hover:scale-105 transition-transform active:scale-95"
      >
        <Image
          src="/bing-cloud.png"
          alt="BingeCloud"
          width={180}
          height={50}
          className="h-10 w-auto brightness-110 drop-shadow-[0_0_15px_rgba(0,174,239,0.3)]"
          priority
        />
      </Link>
    </header>
  );
};

export default Header;
