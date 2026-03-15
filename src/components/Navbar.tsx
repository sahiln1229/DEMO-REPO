"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, Download, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Experience", href: "#experience" },
  { name: "Achievements", href: "#achievement" },
  { name: "Tech Stack", href: "#tech" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll();

  // Scroll listener to detect active section strictly using absolute height bounds crossing
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 150; // safe window offset triggering

      // Iterate backwards to find the last section the user has scrolled into view
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const section = document.querySelector(item.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          const top = rect.top + window.scrollY;

          if (scrollPosition >= top) {
            setActiveSection(item.href.substring(1));
            break; // Stop immediately once bottom-most crossed is found
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on mount
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? "bg-white/95 dark:bg-[#040811]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Scroll Progress Bar at the absolute header bottom */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 origin-left z-20 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
      />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">

        {/* Logo Profile frame */}
        <a href="#" className="flex flex-col group gap-0.5 z-50">
          <span className="font-display text-2xl md:text-3xl font-black tracking-wider text-gray-900 dark:text-white uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
            SAHIL NARKAR
          </span>
          <span className="text-xs tracking-widest text-blue-600 dark:text-blue-400/80 font-bold uppercase transition-all duration-300">
            Full Stack Developer
          </span>
        </a>

        {/* Desktop Nav Items link lists */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`text-sm font-semibold relative py-2 transition-all duration-300 flex flex-col items-center group cursor-pointer ${isActive ? "text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                {/* Active animated pulsed Dot above text items */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3B82F6]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span className="group-hover:scale-105 transition-transform duration-200">
                  {item.name}
                </span>

                {/* Smooth flowing bottom underline connector slider */}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Standard Contact CTA Action Trigger */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            Let's Connect
          </a>
        </div>

        {/* Mobile Toggle Trigger Header hamburger */}
        <button
          className="md:hidden text-gray-900 dark:text-white z-50 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} className="text-blue-600 dark:text-blue-400" /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide Full menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white/98 dark:bg-[#040811]/95 backdrop-blur-lg md:hidden flex flex-col items-center justify-center z-40"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ul className="flex flex-col items-center gap-8 font-mono">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);

                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className={`text-2xl font-extrabold tracking-tight transition-all duration-200 block ${isActive ? "text-blue-400 text-3xl" : "text-gray-500 hover:text-white"
                        }`}
                    >
                      {item.name}
                    </a>
                  </motion.li>
                )
              })}
              <motion.li
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="mt-6"
              >
                <a
                  href="/resume.pdf"
                  download="Sahil_Narkar_Resume.pdf"
                  className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  <Download size={18} /> Resume
                </a>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
