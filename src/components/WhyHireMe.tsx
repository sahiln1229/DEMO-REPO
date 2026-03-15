"use client";

import { motion } from "framer-motion";
import { Star, ShieldAlert, Zap, Globe, Heart } from "lucide-react";

const reasons = [
  {
    title: "Strong Technical Versatility",
    description: "Equipped with wide-ranging expertise from backend to mobile layers for handling cohesive architecture setups smoothly.",
    icon: Zap,
  },
  {
    title: "Practical Development Experience",
    description: "Gained from production-ready templates and solving layout/scale setups using best agile methodology routines.",
    icon: Globe,
  },
  {
    title: "Problem Solving Mindset",
    description: "Eager to break down complex queries and architecture bottlenecks with clean optimized debugging logic every turn.",
    icon: ShieldAlert,
  },
  {
    title: "Adaptability to Modern Tech",
    description: "Continuously adding high-value pipelines into the workflow, quickly picking up modern standards or API frameworks readily.",
    icon: Star,
  },
  {
    title: "Commitment to Quality",
    description: "Ensures every aspect from design pixel perfection to scale setup meets high benchmark standards faithfully.",
    icon: Heart,
  },
];

export default function WhyHireMe() {
  return (
    <section id="why-hire-me" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-width-6xl mx-auto px-6 w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Hire Me</h2>
          <p className="text-gray-400 max-w-2xl text-sm font-medium">
            What I bring to the table as a developer, teammate, and builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, index) => {
            // Alternating entrance animations inside layout sets
            const initialAnim = 
              index % 3 === 0 ? { opacity: 0, y: 40, x: 0 } :
              index % 3 === 1 ? { opacity: 0, x: -40, y: 0 } :
              { opacity: 0, x: 40, y: 0 };
              
            return (
              <motion.div
                key={item.title}
                className="p-6 rounded-2xl border border-white/5 bg-[#080B16]/60 backdrop-blur-md relative group overflow-hidden"
                initial={initialAnim}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
              <div className="flex flex-col gap-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <item.icon size={16} />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
