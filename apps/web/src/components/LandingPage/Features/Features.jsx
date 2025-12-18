const Features = () => {
  return (
    <section
      id="features"
      className="w-full px-4 py-16 bg-[#1b3224]/30 border-y border-[#254632]"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center md:text-left max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
            Supercharge Your Code Understanding
          </h2>
          <p className="text-white/70 text-lg">
            Built for developers, students, and anyone who wants to understand
            code faster.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-[#1b3224] border border-[#254632] hover:border-[#36e27b]/50 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#36e27b]/10 flex items-center justify-center text-[#36e27b] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">flash_on</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">
                Instant Explanations
              </h3>
              <p className="text-white/60 leading-relaxed">
                Paste any code snippet and get a clear, concise explanation in
                seconds. No waiting, no complexity.
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-[#1b3224] border border-[#254632] hover:border-[#36e27b]/50 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#36e27b]/10 flex items-center justify-center text-[#36e27b] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">code</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">
                Multi-Language Support
              </h3>
              <p className="text-white/60 leading-relaxed">
                JavaScript, Python, Java, and more. Our AI understands syntax
                and logic across popular languages.
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-[#1b3224] border border-[#254632] hover:border-[#36e27b]/50 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#36e27b]/10 flex items-center justify-center text-[#36e27b] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">Learn as You Go</h3>
              <p className="text-white/60 leading-relaxed">
                Perfect for students and beginners. Understand complex
                algorithms and patterns with simple explanations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
