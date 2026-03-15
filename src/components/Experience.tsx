"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2, TerminalIcon } from "lucide-react";

export default function Experience() {
  const responsibilities = [
    "Designed and developed responsive user interfaces using modern frontend frameworks ensuring cross-browser compatibility.",
    "Built and optimized scalable backend systems and RESTful APIs to handle application logic and data processing.",
    "Managed databases with structured schemas while maintaining data integrity and optimized queries.",
    "Wrote production-ready clean code following modern software development practices and agile workflows."
  ];

  const terminalLines = [
    { text: "➜ ~ loading experience...", color: "text-blue-400" },
    { text: "company: Devarena Solutions", color: "text-gray-300" },
    { text: "role: Full Stack Developer Intern", color: "text-gray-300" },

    { text: "initializing responsibilities...", color: "text-yellow-500" },
    { text: "[1/4] Frontend UI: ✅ OK", color: "text-green-400" },
    { text: "[2/4] Backend API: ✅ OK", color: "text-green-400" },
    { text: "[3/4] Database Schemas: ✅ OK", color: "text-green-400" },
    { text: "[4/4] Agile Workflows: ✅ OK", color: "text-green-400" },
    { text: "status: SUCCESS", color: "text-cyan-400 font-bold" }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-w-6xl mx-auto px-6 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <TerminalIcon className="text-blue-500 w-8 h-8 md:w-12 md:h-12" /> Experience
          </h2>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base">
            My professional journey and real-world development experience.
          </p>
        </div>

        {/* 2-Column Split Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          
          {/* Left Side: Animated Terminal Window */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full rounded-2xl border border-white/10 bg-[#060913]/90 backdrop-blur-md shadow-2xl overflow-hidden group hover:border-blue-500/20 transition-all duration-300"
          >
            {/* Terminal Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0c1120] border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-600 font-mono">bash - experience.sh</span>
              <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Terminal Body Screen Panel */}
            <motion.div 
               className="p-6 font-mono text-xs md:text-sm space-y-2 h-[280px] overflow-y-auto"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={{
                 hidden: { opacity: 0 },
                 visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
               }}
            >
              {terminalLines.map((line, index) => (
                <motion.div 
                   key={index}
                   variants={{
                     hidden: { opacity: 0, x: -5 },
                     visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
                   }}
                   className={`${line.color} flex items-start gap-1`}
                >
                   {line.text.startsWith("➜") ? "" : <span className="text-gray-600">➜</span>} {line.text}
                </motion.div>
              ))}

              {/* Blinking continuous Cursor */}
              <div className="flex items-center gap-1 text-blue-400">
                 <span>➜</span> <div className="w-2 h-4 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Structured Text Blocks (No Cards) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start gap-6"
          >
            <div>

              <h3 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-1 tracking-tight">
                Internship – Full Stack Developer
              </h3>
              <p className="text-lg font-semibold text-blue-500/80 mb-6">Devarena Solutions</p>
            </div>

            <div className="space-y-4 w-full">
              {responsibilities.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                >
                  <div className="p-1 rounded-md bg-transparent text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-300 mt-0.5">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed group-hover:text-gray-200 transition-colors">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
