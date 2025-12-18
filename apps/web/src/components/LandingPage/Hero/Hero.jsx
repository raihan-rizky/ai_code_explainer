import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full px-4 py-12 md:py-20 lg:py-24 max-w-7xl relative">
      {/* Animated Background Orbs */}
      <div
        className="absolute -inset-[200px] pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Large Green Orb - Top Left */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #36e27b 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
            animation: "float-1 20s ease-in-out infinite",
          }}
        />
        {/* Cyan Orb - Top Right */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
            top: "10%",
            right: "-5%",
            animation: "float-2 25s ease-in-out infinite",
          }}
        />
        {/* Purple Orb - Bottom Center */}
        <div
          className="absolute w-[350px] h-[350px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            bottom: "0%",
            left: "30%",
            animation: "float-3 22s ease-in-out infinite",
          }}
        />
        {/* Small Green Orb - Center Right */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full opacity-20 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #36e27b 0%, transparent 70%)",
            top: "50%",
            right: "20%",
            animation: "float-4 18s ease-in-out infinite",
          }}
        />
        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(54, 226, 123, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(54, 226, 123, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Background Animation Keyframes */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, 20px) scale(1.05); }
          50% { transform: translate(-20px, 40px) scale(0.95); }
          75% { transform: translate(40px, -10px) scale(1.02); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.08); }
          66% { transform: translate(20px, -40px) scale(0.92); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-20px, 30px); }
          50% { transform: translate(30px, 10px); }
          75% { transform: translate(-10px, -20px); }
        }
      `}</style>

      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
        {/* Hero Text */}
        <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3224] border border-[#254632] w-fit mx-auto lg:mx-0">
              <span className="material-symbols-outlined text-[#36e27b] text-sm">
                auto_awesome
              </span>
              <span className="text-xs font-medium text-white/80">
                Powered by Llama 3.3 70B
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text animate-gradient-x"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #36e27b,  #22d3ee, #36e27b)",
                backgroundSize: "300% 100%",
                animation: "gradient-shift 6s ease infinite",
              }}
            >
              Understand Any Code in Seconds.
            </h1>
            <style>{`
              @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
            <h2 className="text-base md:text-lg font-normal text-white/70 max-w-xl mx-auto lg:mx-0">
              Type your code and get clear, instant explanations—powered by AI.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-16px sm:w-auto">
            {/* Animated Border Button */}
            <Link
              to="/app"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-[#36e27b] focus:ring-offset-2 focus:ring-offset-[#112117]"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, #36e27b, #22d3ee, #a855f7, #36e27b)",
                  backgroundSize: "300% 100%",
                  animation: "border-flow 4s linear infinite",
                }}
              />
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#112117] px-8 transition-colors group-hover:bg-[#1b3224]">
                <span className="text-base font-bold text-[#36e27b]">
                  Try for Free
                </span>
              </div>
            </Link>
            <style>{`
              @keyframes border-flow {
                0% { background-position: 0% 50%; }
                100% { background-position: 300% 50%; }
              }
            `}</style>
          </div>
        </div>

        {/* Hero Visual / Mockup */}
        <div className="w-full flex-1 relative">
          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#36e27b]/20 blur-[100px] rounded-full z-10"></div>
          {/* RESPONSIVE FIX: flex-col on mobile, aspect ratio on md */}
          <div className="w-full bg-[#1b3224] border border-[#254632] rounded-xl p-2 shadow-2xl overflow-hidden aspect-auto md:aspect-[4/3] flex flex-col">
            <div className="w-full h-full bg-[#112117] rounded-lg overflow-hidden relative p-4 flex flex-col gap-4 md:block">
              {/* Code Input Mockup - RELATIVE on mobile */}
              <div className="relative md:absolute md:top-4 md:left-4 md:right-4">
                <div className="bg-[#1b3224] border border-[#254632] p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="text-xs text-[#36e27b] font-mono overflow-hidden">
                    <code>{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}`}</code>
                  </pre>
                </div>
              </div>
              {/* AI Response Mockup - RELATIVE on mobile */}
              <div className="relative md:absolute md:bottom-4 md:left-4 md:right-4">
                <div
                  className="relative p-[1px] rounded-2xl rounded-tl-none overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #36e27b, #22d3ee, #36e27b)",
                    backgroundSize: "200% 200%",
                    animation: "shimmer-border 3s ease infinite",
                  }}
                >
                  <div className="bg-[#112117]/95 backdrop-blur-xl p-4 rounded-2xl rounded-tl-none">
                    {/* Header with animated icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#36e27b] to-[#22d3ee] flex items-center justify-center"
                          style={{
                            animation: "pulse-glow 2s ease-in-out infinite",
                          }}
                        >
                          <span className="material-symbols-outlined text-[#112117] text-sm">
                            auto_awesome
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white">
                            Codexa
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#36e27b] animate-pulse"></span>
                            <span className="text-[10px] text-[#36e27b]">
                              AI Response
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Typing indicator */}
                      <div className="flex items-center gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#36e27b]"
                          style={{
                            animation: "typing-dot 1.4s ease-in-out infinite",
                          }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#36e27b]"
                          style={{
                            animation:
                              "typing-dot 1.4s ease-in-out 0.2s infinite",
                          }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#36e27b]"
                          style={{
                            animation:
                              "typing-dot 1.4s ease-in-out 0.4s infinite",
                          }}
                        ></div>
                      </div>
                    </div>
                    {/* Response text with gradient highlight */}
                    <p className="text-sm text-white/90 leading-relaxed">
                      <span className="text-[#36e27b] font-semibold">
                        Recursive Function:
                      </span>{" "}
                      This is a recursive implementation of the Fibonacci
                      sequence. It returns the nth Fibonacci number by
                      recursively calling itself...
                    </p>
                    {/* Footer tags */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      <span className="px-2 py-0.5 rounded-full bg-[#36e27b]/10 text-[10px] text-[#36e27b] font-medium">
                        recursion
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#22d3ee]/10 text-[10px] text-[#22d3ee] font-medium">
                        algorithm
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#a855f7]/10 text-[10px] text-[#a855f7] font-medium">
                        O(2^n)
                      </span>
                    </div>
                  </div>
                </div>
                {/* Animation keyframes */}
                <style>{`
                  @keyframes shimmer-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(54, 226, 123, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(54, 226, 123, 0.6), 0 0 30px rgba(54, 226, 123, 0.3); }
                  }
                  @keyframes typing-dot {
                    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
                    30% { opacity: 1; transform: scale(1); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
