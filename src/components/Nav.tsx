"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";

const links = [
  { id: "about", label: "소개" },
  { id: "skills", label: "기술" },
  { id: "projects", label: "프로젝트" },
  { id: "app", label: "Done It" },
  { id: "contact", label: "연락" },
];

export default function Nav() {
  const [activeId, setActiveId] = useState("about");

  // 화면 가운데에 걸린 섹션을 현재 메뉴로 표시합니다.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    links.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <ul className="clay flex gap-1 bg-white/80 p-1.5 backdrop-blur">
        {links.map((link) => (
          <li key={link.id} className="relative">
            {activeId === link.id && (
              <motion.span
                layoutId="nav-pill"
                transition={SQUISH_SPRING}
                className="clay-sm absolute inset-0 bg-lilac"
              />
            )}
            <motion.a
              href={`#${link.id}`}
              whileTap={SQUISH_TAP}
              transition={SQUISH_SPRING}
              className="relative block px-3 py-2 font-display text-base text-ink sm:px-5"
            >
              {link.label}
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
