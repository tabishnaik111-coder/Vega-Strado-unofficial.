import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const headlineContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const headlineItem = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Hero() {
  const visualRef = useRef(null);
  const [canTilt, setCanTilt] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(smoothY, [-1, 1], [7, -7]);

  const frontX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const frontY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const backX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const backY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const floatingX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const floatingY = useTransform(smoothY, [-1, 1], [-14, 14]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    const update = () => {
      setCanTilt(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  const handleMouseMove = (event) => {
    if (!canTilt || !visualRef.current) return;

    const rect = visualRef.current.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="vega-hero">
      <div className="vega-hero__background">
        <motion.div
          className="vega-hero__blob vega-hero__blob--coral"
          animate={{
            x: [0, 25, -10, 0],
            y: [0, -20, 15, 0],
            rotate: [0, 8, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="vega-hero__blob vega-hero__blob--yellow"
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -15, 0],
            rotate: [0, -6, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="vega-hero__inner">
        <div className="vega-hero__content">
          <motion.div
            className="vega-hero__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span>✦</span>
            NEW SEASON
          </motion.div>

          <motion.h1
            className="vega-hero__title"
            variants={headlineContainer}
            initial="hidden"
            animate="visible"
          >
            <span className="vega-hero__title-line">
              {["WEAR", "WHAT", "SETS"].map((word) => (
                <motion.span key={word} variants={headlineItem}>
                  {word}
                </motion.span>
              ))}
            </span>

            <span className="vega-hero__title-line vega-hero__title-line--accent">
              <motion.span variants={headlineItem}>YOU</motion.span>

              <motion.span
                className="vega-hero__star"
                variants={headlineItem}
              >
                ✦
              </motion.span>

              <motion.span variants={headlineItem}>APART.</motion.span>
            </span>
          </motion.h1>

          <motion.p
            className="vega-hero__description"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Street-inspired pieces for people who don't follow the crowd.
          </motion.p>

          <motion.div
            className="vega-hero__actions"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link to="/shop" className="vega-hero__primary-button">
              Shop the drop
              <span>↗</span>
            </Link>

            <Link to="/about" className="vega-hero__secondary-button">
              Our story
            </Link>
          </motion.div>
        </div>

        <div
          ref={visualRef}
          className="vega-hero__visual"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="vega-hero__tilt-wrapper"
            style={{
              rotateX: canTilt ? rotateX : 0,
              rotateY: canTilt ? rotateY : 0,
            }}
          >
            <motion.div
              className="vega-hero__card vega-hero__card--back"
              style={{
                x: canTilt ? backX : 0,
                y: canTilt ? backY : 0,
              }}
              initial={{ opacity: 0, x: 80, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 8 }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span>VEGA</span>
              <strong>STRADO</strong>
            </motion.div>

            <motion.div
              className="vega-hero__card vega-hero__card--front"
              style={{
                x: canTilt ? frontX : 0,
                y: canTilt ? frontY : 0,
              }}
              initial={{ opacity: 0, x: 80, rotate: -8 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="vega-hero__card-symbol">V</div>

              <div className="vega-hero__card-label">
                <span>VEGA STRADO</span>
                <span>EST. 2026</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="vega-hero__floating-label"
            style={{
              x: canTilt ? floatingX : 0,
              y: canTilt ? floatingY : 0,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span>✦</span>
            MADE TO
            <br />
            STAND OUT
          </motion.div>

          <motion.div
            className="vega-hero__circle"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span>VEGA STRADO • VEGA STRADO • </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="vega-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.3,
          duration: 0.6,
        }}
      >
        <span>SCROLL TO EXPLORE</span>
        <span className="vega-hero__scroll-line" />
      </motion.div>
    </section>
  );
}

export default Hero;