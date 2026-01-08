import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaMicrophone, FaSearch, FaLanguage } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { language, toggleLanguage, t } = useLanguage();
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        toggleMenu(); // Close mobile menu if open
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products?search=${keyword}`);
        } else {
            navigate('/products');
        }
    };

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setKeyword(transcript);
                navigate(`/products?search=${transcript}`);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                alert(t('nav.voice_fail'));
            };
        } else {
            alert(t('nav.not_supported'));
        }
    };

    return (
        <nav className="glass-dark text-white shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
                <Link to="/" className="text-2xl font-black flex items-center gap-2 whitespace-nowrap tracking-tighter hover:scale-105 transition duration-300">
                    <span className="bg-white text-green-700 p-1 rounded-lg">🌿</span> Dharti Ka Swad
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex flex-grow max-w-xl mx-4">
                    <form onSubmit={handleSearch} className="w-full flex">
                        <input
                            type="text"
                            placeholder={t('nav.search_placeholder')}
                            className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="button" onClick={startVoiceSearch} className="bg-white text-green-600 px-3 border-l hover:bg-gray-100 transition" title="Voice Search">
                            <FaMicrophone />
                        </button>
                        <button type="submit" className="bg-green-800 px-6 rounded-r-lg hover:bg-green-900 transition font-bold">
                            <FaSearch />
                        </button>
                    </form>
                </div>

                {/* Desktop Menu Links */}
                <div className="hidden md:flex space-x-6 items-center whitespace-nowrap">
                    <Link to="/" className="hover:text-green-200 transition">{t('nav.home')}</Link>
                    <Link to="/products" className="hover:text-green-200 transition">{t('nav.products')}</Link>
                    <Link to="/recipes" className="hover:text-green-200 transition">{t('nav.recipes')}</Link>
                    <Link to="/farmers" className="hover:text-green-200 transition">{t('nav.farmers')}</Link>
                </div>

                {/* Icons & Mobile Toggle */}
                <div className="flex items-center gap-4 whitespace-nowrap">
                    <div className="hidden md:flex space-x-4 items-center">
                        <Link to="/cart" className="flex items-center gap-1 hover:text-green-200 transition relative">
                            <FaShoppingCart className="text-xl" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border border-white">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {userInfo ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 hover:text-green-200 transition font-semibold focus:outline-none">
                                    <FaUser /> <span className="max-w-[100px] truncate">{userInfo.name.split(' ')[0]}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-green-50 transition">{t('nav.profile')}</Link>
                                    <Link to="/myorders" className="block px-4 py-2 hover:bg-green-50 transition">{t('nav.my_orders') || 'My Orders'}</Link>
                                    <Link to="/contact" className="block px-4 py-2 hover:bg-green-50 transition">{t('nav.contact')}</Link>
                                    <Link to="/help" className="block px-4 py-2 hover:bg-green-50 transition">{t('nav.help') || 'Help & Support'}</Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition flex items-center gap-2">
                                        <FaSignOutAlt /> {t('nav.logout')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-sm">
                                <Link to="/login" className="hover:text-green-200 transition font-medium">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/signup" className="bg-white text-green-600 px-3 py-1.5 rounded hover:bg-green-50 transition font-bold shadow-sm">
                                    {t('nav.signup')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Language Toggle Button */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 bg-green-800 hover:bg-green-900 border border-green-600 px-2 py-1 rounded-lg transition text-xs font-bold uppercase tracking-wider"
                        title={language === 'en' ? t('nav.switch_hi') : t('nav.switch_en')}
                    >
                        <FaLanguage size={18} />
                        {language === 'en' ? 'हिन्दी' : 'EN'}
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden text-2xl focus:outline-none"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-green-700 py-4 px-4 space-y-4 animate-fade-in-up">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex mb-4">
                        <input
                            type="text"
                            placeholder={t('nav.search_placeholder')}
                            className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="button" onClick={startVoiceSearch} className="bg-white text-green-600 px-3 border-l" >
                            <FaMicrophone />
                        </button>
                        <button type="submit" className="bg-green-900 px-4 rounded-r-lg font-bold">
                            <FaSearch />
                        </button>
                    </form>

                    <Link to="/" onClick={toggleMenu} className="block hover:text-green-200 transition border-b border-green-600 pb-2">{t('nav.home')}</Link>
                    <Link to="/products" onClick={toggleMenu} className="block hover:text-green-200 transition border-b border-green-600 pb-2">{t('nav.products')}</Link>
                    <Link to="/recipes" onClick={toggleMenu} className="block hover:text-green-200 transition border-b border-green-600 pb-2">{t('nav.recipes')}</Link>
                    <Link to="/farmers" onClick={toggleMenu} className="block hover:text-green-200 transition border-b border-green-600 pb-2">{t('nav.farmers')}</Link>

                    <div className="flex flex-col space-y-3 pt-2">
                        <Link to="/cart" onClick={toggleMenu} className="flex items-center gap-2 hover:text-green-200 transition">
                            <FaShoppingCart /> {t('nav.cart')} ({cartItems.length})
                        </Link>

                        {userInfo ? (
                            <>
                                <div className="font-semibold text-green-200 border-b border-green-600 pb-2">Hi, {userInfo.name}</div>
                                <Link to="/profile" onClick={toggleMenu} className="block hover:text-green-200 transition">{t('nav.profile')}</Link>
                                <Link to="/myorders" onClick={toggleMenu} className="block hover:text-green-200 transition">{t('nav.my_orders')}</Link>
                                <Link to="/contact" onClick={toggleMenu} className="block hover:text-green-200 transition">{t('nav.contact')}</Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-200 transition text-left w-full pt-2">
                                    <FaSignOutAlt /> {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4 pt-2">
                                <Link to="/login" onClick={toggleMenu} className="flex-1 text-center border border-white py-2 rounded hover:bg-green-600 transition">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/signup" onClick={toggleMenu} className="flex-1 text-center bg-white text-green-700 py-2 rounded font-bold hover:bg-gray-100 transition">
                                    {t('nav.signup')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
