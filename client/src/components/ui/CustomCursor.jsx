import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    const updateEnabled = () => {
      setEnabled(mediaQuery.matches);
    };

    updateEnabled();

    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (event) => {
      document.documentElement.style.setProperty(
        "--vega-cursor-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--vega-cursor-y",
        `${event.clientY}px`
      );
    };

    const handleMouseOver = (event) => {
      const target = event.target;

      if (
        target.closest(
          "a, button, input, textarea, select, [role='button']"
        )
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className={`vega-cursor ${hovering ? "is-hovering" : ""}`}
      animate={{
        x: "var(--vega-cursor-x)",
        y: "var(--vega-cursor-y)",
        scale: hovering ? 1.8 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 0.25,
      }}
    >
      <span />
    </motion.div>
  );
}

export default CustomCursor;