import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData'; // Import Mock Data

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/products?t=${Date.now()}`);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();

                if (data.length > 0) {
                    setProducts(data.reverse());
                } else {
                    // Fallback to Mock Data if DB is empty
                    console.log("Database empty, using Demo Data");
                    setProducts(mockProducts);
                }
            } catch (error) {
                console.error('Error fetching products (Using Demo Data):', error);
                setProducts(mockProducts); // Fallback to Mock Data on Error
            }
        };
        fetchProducts();
    }, []);

    const handleQuickAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        alert(`${product.name} ${t('products.added_to_cart')}`);
    };

    return (
        <div className="space-y-12 md:space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[500px] md:min-h-[600px] flex items-center rounded-3xl md:rounded-[3rem] overflow-hidden bg-green-900 border border-white/10 shadow-3xl animate-fade-in group mx-2 md:mx-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20"></div>

                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-1/2 h-1/2 bg-green-500 rounded-full opacity-20 blur-[120px] group-hover:opacity-30 transition-opacity duration-1000"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-1/2 h-1/2 bg-yellow-500 rounded-full opacity-10 blur-[100px] group-hover:opacity-20 transition-opacity duration-1000"></div>

                <div className="relative container mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 py-10 md:py-16">
                    <div className="md:w-3/5 space-y-6 md:space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-6 py-2 glass rounded-full text-green-100 font-bold text-[10px] md:text-sm tracking-widest animate-bounce mx-auto md:mx-0">
                            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                            {t('home.hero_badge') || 'AUTHENTIC & ORGANIC'}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                            {t('home.hero_title_1') || 'Pure Taste'} <br />
                            <span className="text-gradient from-green-300 to-green-500 italic">{t('home.hero_title_2') || 'From Soil.'}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-green-100/70 md:w-5/6 leading-relaxed font-medium">
                            {t('home.hero_subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                            <Link to="/products" className="w-full sm:w-auto">
                                <button className="w-full bg-green-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-lg shadow-[0_0_40px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_-5px_rgba(34,197,94,0.6)] hover:bg-green-400 transition-all duration-300 transform hover:-translate-y-2 uppercase tracking-tighter">
                                    {t('home.shop_now')}
                                </button>
                            </Link>
                            <Link to="/farmers" className="w-full sm:w-auto">
                                <button className="w-full glass text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-tighter">
                                    {t('nav.farmers')}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-2/5 flex justify-center w-full">
                        <div className="relative group w-full px-4 md:px-0">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-125 animate-pulse"></div>
                            <img
                                src="/images/home_hero.png"
                                alt="Dharti Hero"
                                className="relative w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700 hover:rotate-2"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 🤖 AI Chef Recommendation Section */}
            <section className="container mx-auto px-2 md:px-4 !mt-8 md:!mt-12">
                <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-3xl md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-2xl border border-white/10 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-[150px] opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 space-y-6 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full text-green-300 font-bold text-xs uppercase tracking-widest border border-white/5 mx-auto md:mx-0">
                                <span className="animate-pulse">🤖</span> AI Chef Intelligence
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                "Its {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!" <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                                    Time for {new Date().getHours() < 12 ? 'Healthy Breakfast' : new Date().getHours() < 17 ? 'Power Lunch' : 'Light Dinner'}?
                                </span>
                            </h2>
                            <p className="text-green-100/80 text-lg font-medium leading-relaxed">
                                Our AI analyzed the weather and time. Based on your location, we recommend these fresh, organic picks for you right now.
                            </p>
                            <Link to="/products?filter=budget">
                                <button className="mt-4 bg-white text-green-900 px-8 py-4 rounded-full font-black shadow-lg hover:bg-green-50 transition transform hover:-translate-y-1">
                                    View AI Menu ✨
                                </button>
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide justify-center md:justify-start">
                            {[
                                { name: "Masala Dosa", price: 80, tag: "Best for Breakfast" },
                                { name: "Fresh Juice", price: 40, tag: "Hydration" }
                            ].map((item, i) => (
                                <div key={i} className="flex-shrink-0 w-60 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition cursor-pointer">
                                    <div className="h-32 bg-black/20 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center text-4xl">
                                        🍽️
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <div className="text-xs font-bold text-green-300 uppercase tracking-widest">{item.tag}</div>
                                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                        <div className="text-2xl font-black text-green-400">₹{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-4xl md:text-5xl font-black text-green-950 dark:text-white tracking-tighter capitalize leading-tight">{t('home.categories_title_1')} <span className="text-green-600 italic">{t('home.categories_title_2')}</span></h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{t('home.categories_subtitle')}</p>
                    </div>
                    <div className="h-px bg-gray-100 flex-grow mx-8 hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { name: 'Breakfast / Dosa', icon: '🥞', color: 'from-amber-400 to-orange-500', label: 'Morning Fresh' },
                        { name: 'Village Snacks', icon: '🍪', color: 'from-orange-400 to-red-600', label: 'Handmade' },
                        { name: 'Fresh Vegetables', icon: '🥦', color: 'from-green-400 to-emerald-700', label: 'Organic' },
                        { name: 'Spices & Pickles', icon: '🌶️', color: 'from-red-400 to-rose-800', label: 'Stone Ground' }
                    ].map((cat, index) => (
                        <Link to="/products" key={index} className="group relative overflow-hidden rounded-[2rem] h-80 flex flex-col justify-end p-8 shadow-xl hover:-translate-y-3 transition-all duration-500">
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                            <div className="absolute top-6 right-6 text-7xl opacity-20 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{cat.icon}</div>
                            <div className="relative z-10 space-y-2">
                                <span className="text-xs font-black text-white/60 tracking-widest uppercase">{cat.label}</span>
                                <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">{cat.name}</h3>
                                <div className="pt-4 flex items-center gap-2 text-white font-bold group-hover:translate-x-2 transition-transform">
                                    {t('home.view_all') || 'Explore'} <span className="text-xl">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4 !mt-32">
                <div className="flex justify-between items-end mb-16 border-b-4 border-green-600/10 pb-8">
                    <div className="space-y-2">
                        <span className="text-green-600 font-black tracking-widest text-xs uppercase">{t('home.featured_badge')}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-green-950 dark:text-white tracking-tighter">{t('home.featured_title_1')} <span className="text-green-600 italic">{t('home.featured_title_2')}</span></h2>
                    </div>
                    <Link to="/products" className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full font-black hover:bg-green-600 hover:text-white transition-all duration-300">
                        {t('home.view_all')} <span className="text-xl">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                    {products.slice(0, 4).map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group relative bg-white dark:bg-gray-800 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-green-900 flex items-center gap-1.5 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        {product.category}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className="absolute bottom-6 right-6 bg-green-600 text-white p-4 rounded-2xl shadow-xl transform translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-green-700 scale-110 active:scale-95"
                                    title="Quick Add to Cart"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5 md:p-8 flex flex-col flex-grow space-y-4">
                                <div>
                                    <h3 className="font-extrabold text-2xl text-green-950 dark:text-white group-hover:text-green-600 transition truncate">{product.name}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">{product.source}</p>
                                </div>

                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t('product_detail.price_label')}</span>
                                        <span className="text-3xl font-black text-green-700 tracking-tighter">₹{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                                        <span className="text-yellow-500 text-xs font-black">★</span>
                                        <span className="text-yellow-700 text-xs font-black">{product.rating || '4.5'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default HomePage;
