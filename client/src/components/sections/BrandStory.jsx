import { motion } from "framer-motion";

const principles = [
  {
    number: "01",
    title: "BE DIFFERENT",
    text: "We believe your clothes should feel like an extension of who you are.",
  },
  {
    number: "02",
    title: "KEEP IT REAL",
    text: "No unnecessary noise. Just strong ideas, thoughtful details and everyday pieces.",
  },
  {
    number: "03",
    title: "MAKE YOUR MARK",
    text: "Wear something that says something before you even say a word.",
  },
];

function BrandStory() {
  return (
    <section
      className="vega-brand-story"
      aria-labelledby="brand-story-title"
    >
      <div className="vega-brand-story__container">
        <div className="vega-brand-story__top">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            THE VEGA STRADO STORY
          </motion.span>

          <motion.span
            className="vega-brand-story__since"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
          >
            MADE TO STAND OUT
          </motion.span>
        </div>

        <motion.div
          className="vega-brand-story__headline"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2 id="brand-story-title">
            CLOTHES
            <br />
            WITH A
            <br />
            <span>POINT OF VIEW.</span>
          </h2>
        </motion.div>

        <div className="vega-brand-story__grid">
          <motion.div
            className="vega-brand-story__visual"
            initial={{
              opacity: 0,
              scale: 0.94,
              rotate: -3,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="vega-brand-story__visual-inner">
              <span className="vega-brand-story__visual-small">
                VS
              </span>

              <motion.span
                className="vega-brand-story__visual-letter"
                whileHover={{
                  scale: 1.05,
                  rotate: -5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 15,
                }}
              >
                V
              </motion.span>

              <span className="vega-brand-story__visual-caption">
                VEGA
                <br />
                STRADO
              </span>

              <span className="vega-brand-story__visual-star">
                ✦
              </span>
            </div>
          </motion.div>

          <motion.div
            className="vega-brand-story__content"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="vega-brand-story__lead">
              VEGA STRADO is built around one simple idea:
              <strong> you don't have to blend in.</strong>
            </p>

            <p>
              We create street-inspired clothing for people who
              enjoy having their own style, their own rhythm and
              their own way of doing things.
            </p>

            <p>
              From everyday essentials to statement pieces, every
              part of VEGA STRADO is designed to feel expressive
              without trying too hard.
            </p>

            <div className="vega-brand-story__signature">
              <span>SMALL THINGS.</span>
              <span>BIG PERSONALITY.</span>
            </div>
          </motion.div>
        </div>

        <div className="vega-brand-story__principles">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.number}
              className="vega-brand-story__principle"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="vega-brand-story__principle-number">
                {principle.number}
              </span>

              <h3>{principle.title}</h3>

              <p>{principle.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandStory;