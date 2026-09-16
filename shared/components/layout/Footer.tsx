"use client";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background/40 backdrop-blur-md border-t border-white/5 py-5 lg:py-6 px-6 lg:px-10 pb-24 lg:pb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-[11px] lg:text-xs">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
          <p className="text-white/50">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold tracking-widest">
              Binge Cloud
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
