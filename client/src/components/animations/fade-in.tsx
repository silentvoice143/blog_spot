// "use client";
// import { motion } from "framer-motion";

// type FadeInProps = {
//   children: React.ReactNode;
//   delay?: number;
//   duration?: number;
//   direction?: "up" | "down" | "left" | "right" | "none";
//   distance?: number;
//   className?: string;
// };

// export const FadeIn = ({
//   children,
//   delay = 0,
//   duration = 0.6,
//   direction = "up",
//   distance = 32,
//   className = "",
// }: FadeInProps) => {
//   const initial: Record<string, number> = { opacity: 0 };
//   const animate: Record<string, number> = { opacity: 1 };

//   if (direction === "up") {
//     initial.y = distance;
//     animate.y = 0;
//   }
//   if (direction === "down") {
//     initial.y = -distance;
//     animate.y = 0;
//   }
//   if (direction === "left") {
//     initial.x = distance;
//     animate.x = 0;
//   }
//   if (direction === "right") {
//     initial.x = -distance;
//     animate.x = 0;
//   }

//   return (
//     <motion.div
//       className={className}
//       initial={initial}
//       whileInView={animate}
//       transition={{
//         duration,
//         delay,
//         ease: [0.25, 0.1, 0.25, 1], // clean cubic-ease-out, no overshoot
//       }}
//       viewport={{ once: true, amount: 0.2 }}
//     >
//       {children}
//     </motion.div>
//   );
// };

"use client";
import { motion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
};

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 36,
  className = "",
}: FadeInProps) => {
  const initial: Record<string, number> = { opacity: 0 };
  const animate: Record<string, number> = { opacity: 1 };

  if (direction === "up") {
    initial.y = distance;
    animate.y = 0;
  }
  if (direction === "down") {
    initial.y = -distance;
    animate.y = 0;
  }
  if (direction === "left") {
    initial.x = distance;
    animate.x = 0;
  }
  if (direction === "right") {
    initial.x = -distance;
    animate.x = 0;
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        // ✅ No per-property overrides — opacity and position animate together
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
