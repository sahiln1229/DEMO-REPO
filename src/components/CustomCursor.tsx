"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState("default");

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setCursorType("hover");
      } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setCursorType("text");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* 🔮 Background Radial Light Glow: Bright and Vibrant following cursor */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(27, 67, 156, 0.2), transparent 70%)"
        }}
      />

      {/* 🔮 Extra Core Inner Shine Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(27, 67, 156, 0.35), transparent 60%)"
        }}
      />

      {/* 🔵 Minimal Core Spotlight Dot Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3B82F6] pointer-events-none z-50 flex items-center justify-center"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: cursorType === "hover" ? 1.4 : cursorType === "text" ? 0.8 : 1,
          backgroundColor: cursorType === "hover" ? "#60A5FA" : "#3B82F6"
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 450,
          mass: 0.1
        }}
      />

      {/* 💍 Optional Outer framing border rings strictly following smooth delay trailing */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-400/20 pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: cursorType === "hover" ? 1.2 : cursorType === "text" ? 0.3 : 1,
          opacity: cursorType === "hover" ? 0.6 : 0.2
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 250,
          mass: 0.3
        }}
      />
    </>
  );
}
