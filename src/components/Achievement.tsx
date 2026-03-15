"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";

const achievements = [
  {
    title: "Cyber Security Hackathon Winner",
    organization: "Vidyalankar Polytechnic",
    description: "Participated and won first place in a university-level Cyber Security Hackathon through teamwork, innovative problem-solving, and efficient technical execution.",
    icon: Trophy,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    className: "border-amber-500/20 text-amber-400",
  },
];

export default function Achievement() {
  return (
    <section id="achievement" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-w-4xl mx-auto px-6 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Achievements</h2>
          <p className="text-gray-400 max-w-2xl">
            Milestones and recognition of technical excellence.
          </p>
        </div>

        <div className="grid gap-8 justify-center items-center">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              className={`max-w-2xl p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/3 to-transparent backdrop-blur-md shadow-2xl relative group overflow-hidden`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glowing gradient background on hover */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl -z-10" />

              <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border flex items-center justify-center ${item.className}`}>
                  <item.icon size={36} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      1st Place
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Medal size={12} /> Hackathon
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-blue-400/80 font-medium text-sm mb-3">
                    {item.organization}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
