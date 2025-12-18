import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="w-full px-4 py-20 bg-[#112117] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b3224] to-transparent opacity-50 pointer-events-none"></div>
      <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Ready to understand code faster?
        </h2>
        <p className="text-white/70 text-lg">
          Start explaining code instantly. No signup required.
        </p>
        <Link
          to="/app"
          className="flex h-14 px-10 items-center justify-center rounded-full bg-[#36e27b] text-[#122118] text-lg font-bold hover:scale-105 transition-all shadow-[0_0_25px_rgba(54,226,123,0.5)]"
        >
          Get Started for Free
        </Link>
        <p className="text-xs text-white/40 mt-2">
          No credit card required • Unlimited explanations
        </p>
      </div>
    </section>
  );
};

export default CTA;
