import { motion, AnimatePresence } from "framer-motion";
import { useCartAnimation } from "../../context/CartAnimationContext";

function FlyingCartItem() {
  const { animation } = useCartAnimation();

  return (
    <AnimatePresence>
      {animation && (
        <motion.div
          key={animation.id}
          className="vega-flying-cart-item"
          initial={{
            opacity: 0,
            scale: 0.5,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8, 0.25],
            x: [0, 40, 180, 280],
            y: [0, -40, -120, -220],
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {animation.image ? (
            <img
              src={animation.image}
              alt=""
            />
          ) : (
            <span>V</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FlyingCartItem;