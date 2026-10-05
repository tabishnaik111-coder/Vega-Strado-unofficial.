import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ShippingReturns from "./pages/ShippingReturns";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";
import { useLenis } from "./hooks/useLenis";
import CustomCursor from "./components/ui/CustomCursor";
import FlyingCartItem from "./components/cart/FlyingCartItem";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";

function App() {
  useLenis();

  return (

    <>
    <CustomCursor/>

    
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route
            path="/product/:slug"
            element={<ProductDetail />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          <Route
            path="/shipping-returns"
            element={<ShippingReturns />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/track-order"
            element={<TrackOrder />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        <Route
  path="/cart"
  element={<Cart />}
/>

<Route
  path="/tracking"
  element={<OrderTracking />}
/>
      </Routes>
    </BrowserRouter>
<FlyingCartItem />
    </>
  );
}

export default App;