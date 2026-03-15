"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.h1
        className="text-white text-xl md:text-2xl font-semibold tracking-wide text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        Sahil Narkar Portfolio is load
      </motion.h1>
    </motion.div>
  );
}
