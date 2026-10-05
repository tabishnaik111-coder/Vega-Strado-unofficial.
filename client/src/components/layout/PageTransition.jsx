import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div className="vega-page-transition">
      <motion.div
        key={location.pathname}
        className="vega-page-transition__content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>

      <motion.div
        key={`wipe-${location.pathname}`}
        className="vega-page-transition__wipe"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: 0.65,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </div>
  );
}

export default PageTransition;