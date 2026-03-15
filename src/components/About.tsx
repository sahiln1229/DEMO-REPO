"use client";

import { motion } from "framer-motion";
import { User, Code, Terminal } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">About Me</h2>
          <p className="text-gray-400 max-w-2xl">
            A developer who loves crafting beautiful interfaces and powerful backends.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
          <motion.div 
            className="flex flex-col items-start text-left gap-5 max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
              Full Stack Passion & Scalable Architecture
            </h3>
            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
              I am a passionate Full Stack Developer with a continuous learning mindset, dedicated to building high-performance index apps with modern tech. My journey focuses on optimizing database integrity and implementing robust server-side algorithms while delivering pixel-perfect user experiences that wow users on multiple viewports.
            </p>
            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
              With practical experience setting up pipelines and architectures, I balance aesthetics and function with clean code templates and adaptive modules that run smooth everywhere.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-5 border-l border-white/5 pl-8 md:min-w-[220px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Terminal className="text-blue-500 w-5 h-5" />
              <div>
                <h4 className="text-white text-sm font-semibold">Problem Solving</h4>
                <p className="text-gray-500 text-xs mt-0.5">Efficient & Scalable</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Code className="text-blue-500 w-5 h-5" />
              <div>
                <h4 className="text-white text-sm font-semibold">Performance</h4>
                <p className="text-gray-500 text-xs mt-0.5">Optimized assets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-blue-500 w-5 h-5" />
              <div>
                <h4 className="text-white text-sm font-semibold">Collaboration</h4>
                <p className="text-gray-500 text-xs mt-0.5">Agile workflows</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
