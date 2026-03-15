"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, Mail, ArrowRight, Download } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <motion.div
        className="max-w-7xl mr-auto pl-8 md:pl-16 pr-6 text-left z-10 flex flex-col items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Open for opportunities
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
        >
          Sahil Narkar
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          animate={{
            filter: [
              "drop-shadow(0 0 2px rgba(59, 130, 246, 0.1))",
              "drop-shadow(0 0 6px rgba(59, 130, 246, 0.35))",
              "drop-shadow(0 0 2px rgba(59, 130, 246, 0.1))",
            ],
          }}
          whileHover={{
            filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
            scale: 1.01,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 cursor-pointer"
        >
          Full Stack Developer Building Modern Digital Solutions
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-400 max-w-2xl text-base md:text-lg mb-8 leading-relaxed"
        >
          I design and develop scalable web and mobile applications by combining modern user interfaces with powerful backend systems. My focus is on building reliable, efficient, and user-friendly digital products that solve real-world problems.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <a
            href="/resume.pdf"
            download="Sahil_Narkar_Resume.pdf"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 group no-underline flex items-center justify-center gap-2 px-6 py-3 text-base"
            )}
          >
            Resume
            <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
          <div className="flex gap-4">
            <a
              href="https://github.com/sahiln1229"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm flex items-center justify-center p-0"
              )}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:sahilnarkar121105@gmail.com"
              aria-label="Email Me"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm flex items-center justify-center p-0"
              )}
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
