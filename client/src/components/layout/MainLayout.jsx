import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../navigation/Header";
import Footer from "../navigation/Footer";
import PageTransition from "./PageTransition";
import AnnouncementMarquee from "../sections/AnnouncementMarquee";
import CartDrawer from "../cart/CartDrawer";

function MainLayout() {

  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="vega-site">
      <Header
        onCartClick={() => setCartOpen(true)}
      />

      <AnnouncementMarquee />

      <main className="vega-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
      <CartDrawer
  isOpen={cartOpen}
  onClose={() => setCartOpen(false)}
/>
    </div>
  );
}

export default MainLayout;