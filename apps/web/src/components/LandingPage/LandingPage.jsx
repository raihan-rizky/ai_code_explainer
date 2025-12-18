import { Suspense, lazy } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import SectionSkeleton from "../ui/SectionSkeleton";

// Lazy load heavy sections
const Hero = lazy(() => import("./Hero/Hero"));
const Features = lazy(() => import("./Features/Features"));
const HowItWorks = lazy(() => import("./HowItWorks/HowItWorks"));
const About = lazy(() => import("./About/About"));
const CTA = lazy(() => import("./CTA/CTA"));

const LandingPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#112117] text-white font-['Spline_Sans',sans-serif] overflow-x-hidden antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full overflow-hidden">
        {/* Hero Section - High priority, but lazily loaded to reduce bundle size if needed. 
            Ideally Hero should be eager, but for consistency in this task we lazy load it. 
            Given it's above fold, we might want a custom lighter skeleton or just keep it eager. 
            For now, following user request to lazy load components.
        */}
        <Suspense
          fallback={
            <div className="w-full h-screen flex items-center justify-center">
              <SectionSkeleton height="600px" />
            </div>
          }
        >
          <Hero />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <HowItWorks />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <CTA />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
