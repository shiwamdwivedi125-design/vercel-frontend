import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RecipesPage from './pages/RecipesPage';
import FarmersPage from './pages/FarmersPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProjectControlPage from './pages/ProjectControlPage';
import HelpCenter from './pages/HelpCenter';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import MobileBottomNav from './components/MobileBottomNav';

function App() {
    return (
        <ThemeProvider>
            <CartProvider>
                <Router>
                    <div className="flex flex-col min-h-screen pb-16 md:pb-0 dark:bg-gray-900 transition-colors duration-300">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductListPage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/myorders" element={<MyOrdersPage />} />
                                <Route path="/track/:id" element={<OrderTrackingPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/project-control" element={<ProjectControlPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="/recipes" element={<RecipesPage />} />
                                <Route path="/farmers" element={<FarmersPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/help" element={<HelpCenter />} />
                            </Routes>
                        </main>
                        <Footer />
                        <MobileBottomNav />
                    </div>
                </Router>
            </CartProvider>
        </ThemeProvider>
    );
}

export default App;
