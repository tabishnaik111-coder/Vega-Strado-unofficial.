import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useCartAnimation } from "../../context/CartAnimationContext";

const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

function Header({ onCartClick }) {
  const { cartCount } = useCart();
  const { cartBounce } = useCartAnimation();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="vega-header">
        <div className="vega-header__inner">
          <NavLink
            to="/"
            className="vega-logo"
            onClick={closeMenu}
          >
            VEGA STRADO
          </NavLink>

          {/* Desktop Navigation */}
          <nav
            className="vega-header__nav"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `vega-nav-link ${
                    isActive ? "is-active" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="vega-header__actions">
            <motion.button
              type="button"
              className="vega-header__icon"
              aria-label="Favorites"
              whileTap={{ scale: 0.9 }}
            >
              ♡
            </motion.button>

            <button
  type="button"
  className="vega-cart-link"
  onClick={onCartClick}
  aria-label={`Shopping cart with ${cartCount} ${
    cartCount === 1 ? "item" : "items"
  }`}
>
  Cart

  <span
    className={`vega-cart-badge ${
      cartBounce ? "is-bouncing" : ""
    }`}
  >
    {cartCount}
  </span>
</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`vega-menu-button ${
              menuOpen ? "is-open" : ""
            }`}
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="vega-mobile-menu"
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <nav
              className="vega-mobile-menu__nav"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{
                    opacity: 0,
                    x: -24,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `vega-mobile-link ${
                        isActive ? "is-active" : ""
                      }`
                    }
                    onClick={closeMenu}
                  >
                    <span>{link.label}</span>

                    <span className="vega-mobile-link__arrow">
                      ↗
                    </span>
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile Cart */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: navLinks.length * 0.07,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
  type="button"
  className="vega-mobile-link vega-mobile-link--cart"
  onClick={() => {
    closeMenu();
    onCartClick();
  }}
  aria-label={`Shopping cart with ${cartCount} ${
    cartCount === 1 ? "item" : "items"
  }`}
>
  <span>Cart</span>

  <span
    className={`vega-cart-badge ${
      cartBounce ? "is-bouncing" : ""
    }`}
  >
    {cartCount}
  </span>
</button>
              </motion.div>
            </nav>

            <motion.div
              className="vega-mobile-menu__footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.35,
              }}
            >
              <span>VEGA STRADO</span>
              <span>
                Small things. Big personality.
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close menu automatically after route changes */}
      {location.pathname && menuOpen && (
        <RouteChangeCloser closeMenu={closeMenu} />
      )}
    </>
  );
}

function RouteChangeCloser({ closeMenu }) {
  return null;
}

export default Header;