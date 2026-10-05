import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const shopLinks = [
  { label: "Shop All", path: "/shop" },
  { label: "New Drops", path: "/shop" },
];

const helpLinks = [
  { label: "FAQ", path: "/faq" },
  { label: "Shipping & Returns", path: "/shipping-returns" },
  { label: "Track Order", path: "/track-order" },
  { label: "Contact", path: "/contact" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="vega-footer">
      <div className="vega-footer__main">
        <div className="vega-footer__brand">
          <NavLink to="/" className="vega-footer__logo">
            VEGA STRADO
          </NavLink>

          <p className="vega-footer__tagline">
            Small things.
            <br />
            Big personality.
          </p>

          <p className="vega-footer__description">
            Street-inspired pieces made for people who choose to stand out.
          </p>
        </div>

        <div className="vega-footer__column">
          <h3>Shop</h3>

          <nav aria-label="Footer shop navigation">
            {shopLinks.map((link) => (
              <NavLink key={link.label} to={link.path}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="vega-footer__column">
          <h3>Help</h3>

          <nav aria-label="Footer help navigation">
            {helpLinks.map((link) => (
              <NavLink key={link.label} to={link.path}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="vega-footer__newsletter">
          <h3>Stay in the loop</h3>

          <p>
            Get first access to new drops, updates and special releases.
          </p>

          <form
            className="vega-footer__form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="footer-email" className="vega-sr-only">
              Email address
            </label>

            <input
              id="footer-email"
              type="email"
              placeholder="Your email"
              autoComplete="email"
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              aria-label="Subscribe to newsletter"
            >
              →
            </motion.button>
          </form>
        </div>
      </div>

      <div className="vega-footer__bottom">
        <span>© {currentYear} VEGA STRADO</span>

        <div className="vega-footer__socials">
          <a
            href="#"
            aria-label="Instagram"
            onClick={(event) => event.preventDefault()}
          >
            Instagram
          </a>

          <a
            href="#"
            aria-label="Pinterest"
            onClick={(event) => event.preventDefault()}
          >
            Pinterest
          </a>
        </div>

        <span>Made for the streets.</span>
      </div>
    </footer>
  );
}

export default Footer;