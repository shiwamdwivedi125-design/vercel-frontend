import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaLeaf, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useContext } from 'react';
import CartContext from '../context/CartContext';

const MobileBottomNav = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const { cartItems } = useContext(CartContext);

    const navItems = [
        { path: '/', icon: <FaHome />, labelKey: 'nav.home' },
        { path: '/products', icon: <FaLeaf />, labelKey: 'nav.products' },
        { path: '/recipes', icon: <FaUtensils />, labelKey: 'nav.recipes' },
        { path: '/cart', icon: <FaShoppingCart />, labelKey: 'nav.cart', showCount: true },
        { path: '/profile', icon: <FaUser />, labelKey: 'nav.profile' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-[100] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive(item.path)
                            ? 'text-green-600 bg-green-50 scale-110'
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                >
                    <div className="relative text-xl">
                        {item.icon}
                        {item.showCount && cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border border-white">
                                {cartItems.reduce((acc, i) => acc + i.qty, 0)}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MobileBottomNav;
