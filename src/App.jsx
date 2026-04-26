import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfferStrip } from './components/layout/OfferStrip';
import { CartDrawer } from './components/cart/CartDrawer';
import { EditModeBar } from './components/admin/EditModeBar';

const SplashScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#e0f4ee]"
  >
    <motion.img
      src="/logo.png"
      alt="A'DOREMOM"
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="h-40 md:h-56 object-contain mix-blend-multiply"
    />
  </motion.div>
);

// Inner shell — knows current route via useLocation
const AppShell = ({ loading }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    // Fully isolated admin experience — no public navbar/footer
    return <AppRoutes />;
  }

  return (
    <div className="w-full flex flex-col min-h-screen relative overflow-hidden">
      <OfferStrip />
      <Navbar />
      <CartDrawer />
      <EditModeBar />
      <main className="flex-grow flex flex-col">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>
      <AppShell loading={loading} />
    </Router>
  );
}

export default App;
