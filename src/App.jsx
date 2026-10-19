import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import EventSection from './components/EventSection';
import OrderingInfo from './components/OrderingInfo';
import Contact from './components/Contact';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load saved user from local storage on startup
  useEffect(() => {
    const saved = localStorage.getItem('kedai_burju_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kedai_burju_user');
    setUser(null);
  };

  const handleAddToCart = (item) => {
    const variantName = item.selectedVariant ? item.selectedVariant.name : null;
    const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.variantName === variantName
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: itemPrice,
            image: item.image,
            variantName: variantName,
            quantity: 1
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-main">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        <Hero />
        <About />
        <Menu
          onSelectOrder={(item) => {
            // Add item to cart and open cart drawer
            handleAddToCart(item);
          }}
        />
        <EventSection />
        <OrderingInfo />
        <Contact />
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Direct In-App Checkout & QRIS Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        user={user}
        onRequireLogin={() => {
          setIsCheckoutOpen(false);
          setIsAuthOpen(true);
        }}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
