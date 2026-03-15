"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Achievement from "@/components/Achievement";
import TechStack from "@/components/TechStack";
import WhyHireMe from "@/components/WhyHireMe";
import Contact from "@/components/Contact";
import ThreeBackground from "@/components/ThreeBackground";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 Seconds standard duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>
      <main className={`min-h-screen font-sans antialiased text-white selection:bg-blue-500/30 selection:text-white ${isLoading ? "overflow-hidden h-screen" : "overflow-y-auto"}`}>
        <CustomCursor />
        <ThreeBackground />
        <Navbar />
        <div className="flex flex-col">
          <Hero />
          <About />
          <Education />
          <Experience />
          <Achievement />
          <TechStack />
          <WhyHireMe />
          <Contact />
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-xs md:text-sm">
          <div className="max-w-7xl mx-auto px-6">
            <p>&copy; {new Date().getFullYear()} Sahil Narkar. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
