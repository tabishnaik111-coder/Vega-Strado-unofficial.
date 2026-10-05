import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 100,
    suffix: "%",
    label: "GOOD ENERGY",
    description: "Designed with personality from the first idea to the final detail.",
  },
  {
    value: 24,
    suffix: "/7",
    label: "YOUR STYLE",
    description: "Pieces made to fit into your everyday rhythm, whenever you move.",
  },
  {
    value: 3,
    suffix: "X",
    label: "MORE ATTITUDE",
    description: "Every collection brings its own mood, while staying unmistakably Vega.",
  },
];

const trustPoints = [
  "DESIGNED FOR EVERYDAY LIFE",
  "STREET-INSPIRED DETAILS",
  "MADE TO STAND OUT",
];

function AnimatedNumber({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1000;
    const startTime = performance.now();

    let animationFrame;

    const updateCounter = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView, value]);

  return (
    <span ref={ref} className="vega-social-proof__number">
      {count}
      {suffix}
    </span>
  );
}

function SocialProof() {
  return (
    <section
      className="vega-social-proof"
      aria-labelledby="social-proof-title"
    >
      <div className="vega-social-proof__container">
        <div className="vega-social-proof__header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="vega-section-eyebrow">
              WHY VEGA STRADO
            </span>

            <h2 id="social-proof-title">
              THE NUMBERS
              <br />
              <span>SPEAK.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            More than clothes. It's a mindset built around
            individuality, confidence and having your own way
            of doing things.
          </motion.p>
        </div>

        <div className="vega-social-proof__stats">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              className="vega-social-proof__stat"
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
              />

              <h3>{stat.label}</h3>

              <p>{stat.description}</p>

              <span className="vega-social-proof__stat-line" />
            </motion.article>
          ))}
        </div>

        <motion.div
          className="vega-social-proof__trust"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="vega-social-proof__trust-heading">
            <span>THE VEGA STANDARD</span>
          </div>

          <div className="vega-social-proof__trust-list">
            {trustPoints.map((point, index) => (
              <div
                className="vega-social-proof__trust-item"
                key={point}
              >
                <span className="vega-social-proof__trust-number">
                  0{index + 1}
                </span>

                <span>{point}</span>

                <span className="vega-social-proof__trust-icon">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SocialProof;