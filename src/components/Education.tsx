"use client";

import { motion } from "framer-motion";
import { GraduationCap, School, BookOpen } from "lucide-react";

const educationDetails = [
  {
    icon: School,
    title: "SSC",
    institution: "Balmohan Vidyamandir",
    result: "82%",
    status: "Completed",
    description: "Completed secondary education with strong academic performance and developed an early interest in computers and technology.",
  },
  {
    icon: BookOpen,
    title: "Diploma in Information Technology",
    institution: "Vidyalankar Polytechnic",
    result: "85%",
    status: "Completed",
    description: "Studied programming, networking, databases, and web development which built a strong technical foundation.",
  },
  {
    icon: GraduationCap,
    title: "B.Tech in Computer Engineering",
    institution: "Bharati Vidyapeeth (Deemed to be University)",
    result: "Currently Pursuing",
    status: "Ongoing",
    description: "Currently pursuing a Bachelor's degree in Computer Engineering while focusing on full stack development and modern technologies.",
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-w-6xl mx-auto px-6 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-blue-500 font-extrabold uppercase tracking-widest text-xs mb-2">MY EDUCATION</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Academic Background</h2>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base">
            My academic journey that built the foundation of my technical skills.
          </p>
        </div>

        {/* Center Vertical Timeline Pillar Layout */}
        <div className="relative max-w-5xl mx-auto mt-12">
          
          {/* Central glowing vertical line (Desktop only) */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-[30px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-0" 
          />

          {/* Render Milestones List */}
          <div className="space-y-12 md:space-y-16">
            {educationDetails.map((item, index) => {
               const isLeft = index % 2 === 0;
               const numericResult = parseInt(item.result) || 100;

               return (
                 <div key={index} className={`flex flex-col md:flex-row items-start md:items-center w-full relative ${isLeft ? "md:justify-start" : "md:justify-end"}`}>
                   
                   {/* Middle Core Timeline Node dot */}
                   <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 p-1.5 bg-[#030712] rounded-full border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10">
                     <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                   </div>

                   {/* Standard Card bounds container sectioning */}
                   <div className={`w-full md:w-[calc(50%-40px)] pl-16 md:pl-0 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                     <motion.div
                       initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 15 }}
                       whileInView={{ opacity: 1, x: 0, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       transition={{ duration: 0.6, delay: index * 0.1 }}
                       whileHover={{ y: -5, scale: 1.02 }}
                       className="p-6 md:p-8 rounded-w-3xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#080B16]/60 backdrop-blur-md shadow-lg dark:shadow-2xl relative group hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.06)] transition-all duration-300"
                     >
                        {/* Connecting Horizontal Line (Desktop only) */}
                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-blue-500/40 to-transparent ${isLeft ? "left-full" : "right-full"} -z-10`} />

                        {/* Backplate subtle neon overlay */}
                        <div className="absolute inset-0 bg-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl -z-10" />

                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <item.icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{item.title}</h3>
                            <p className="text-opacity-70 text-gray-500 text-xs mt-0.5">{item.status}</p>
                          </div>
                        </div>

                        <p className="text-blue-400/90 text-sm font-medium mb-2">{item.institution}</p>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">{item.description}</p>

                        {/* Animated Progress indicator section */}
                        <div className="w-full space-y-2 mt-auto">
                           <div className="flex items-center justify-between text-[11px] font-bold">
                             <span className="text-gray-500">{item.title === "B.Tech in Computer Engineering" ? "Status" : "Percentage"}</span>
                             <span className="text-blue-400">{item.result}</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div
                               initial={{ width: 0 }}
                               whileInView={{ width: `${item.title === "B.Tech in Computer Engineering" ? 65 : numericResult}%` }}
                               viewport={{ once: true }}
                               transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                               className={`h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_#3B82F6] ${item.title === "B.Tech in Computer Engineering" ? "animate-pulse" : ""}`}
                             />
                           </div>
                        </div>
                     </motion.div>
                   </div>
                 </div>
               )
            })}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
