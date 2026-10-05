import { motion } from "framer-motion";

const announcements = [
  "VEGA STRADO",
  "SMALL THINGS. BIG PERSONALITY.",
  "NEW DROPS",
  "BUILT FOR THE STREETS",
];

function AnnouncementMarquee() {
  const items = [...announcements, ...announcements];

  return (
    <div className="vega-marquee" aria-label="Store announcements">
      <motion.div
        className="vega-marquee__track"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((item, index) => (
          <div className="vega-marquee__item" key={`${item}-${index}`}>
            <span>{item}</span>
            <span className="vega-marquee__dot">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default AnnouncementMarquee;