import { motion } from "framer-motion";
import { fadeUp } from "../../animations/motion";

function MotionWrapper({
  children,
  className = "",
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default MotionWrapper;