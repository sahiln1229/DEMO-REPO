"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "frontend", name: "Frontend", description: "Building beautiful, responsive user interfaces" },
  { id: "backend", name: "Backend", description: "Creating robust, scalable server side logic" },
  { id: "tools", name: "Tools", description: "Optimizing development with modern packages" },
  { id: "mobile", name: "Mobile", description: "Developing intuitive mobile platforms" },
];

const techItems: { [key: string]: { name: string; icon: string }[] } = {
  frontend: [
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  ],
  backend: [
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  ],
  tools: [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  ],
  mobile: [
    { name: "React Native", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  ],
};

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState("frontend");

  return (
    <section id="tech" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div 
        className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Technical Skills</h2>
          <p className="text-sm text-gray-400 font-medium">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Split Layout */}
        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          {/* Left Sidebar: Categories Navigation */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl flex flex-col gap-1.5 transition-all duration-200 border-l-4 ${
                  activeCategory === cat.id
                    ? "bg-blue-500/5 border-blue-500 text-white"
                    : "bg-transparent text-gray-500 hover:text-gray-300 border-transparent hover:bg-white/2"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-base md:text-lg font-extrabold tracking-tight ${activeCategory === cat.id ? "text-blue-400" : "text-gray-200"}`}>
                    {cat.name}
                  </span>
                </div>
                <span className={`text-xs md:text-sm font-medium leading-relaxed ${activeCategory === cat.id ? "text-gray-300" : "text-gray-600"}`}>
                  {cat.description}
                </span>
              </button>
            ))}
          </div>

          {/* Right Grid Content */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
              >
                {techItems[activeCategory]?.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="p-5 rounded-2xl border border-white/5 bg-[#080B16]/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 hover:border-white/10 hover:bg-[#080B16]/80 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center relative">
                      <img 
                        src={item.icon} 
                        alt={item.name} 
                        className={`w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-300 ${["Express.js", "GitHub", "Next.js"].includes(item.name) ? "invert" : ""}`} 
                      />
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
