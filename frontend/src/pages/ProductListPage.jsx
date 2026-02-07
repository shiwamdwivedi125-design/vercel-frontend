import { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import config from '../config';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData'; // Import Mock Data

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const { addToCart } = useContext(CartContext);
    const { t } = useLanguage();
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/products?t=${Date.now()}`);
                if (!res.ok) throw new Error('API Error');
                const data = await res.json();

                if (data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(mockProducts); // Fallback
                }
            } catch (error) {
                console.error('Error fetching products (Using Demo Data):', error);
                setProducts(mockProducts); // Fallback
            }
        };
        fetchProducts();
    }, []);

    const handleQuickAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("ProductList: Quick Add Clicked for", product.name);
        addToCart(product, 1);
        alert(`${product.name} ${t('products.added_to_cart')}`);
    };

    const [showBudget, setShowBudget] = useState(false);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchesBudget = showBudget ? p.price <= 100 : true;
        return matchesSearch && matchesBudget;
    });

    return (
        <div className="space-y-12 pb-20">
            <header className="text-center md:text-left space-y-4 pt-4 md:pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-green-950 dark:text-white tracking-tighter leading-tight px-2 md:px-0">
                    {t('products.title_main')} <span className="text-green-600 italic">{t('products.title_italic')}</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl px-4 md:px-0 mx-auto md:mx-0">
                    {t('products.subtitle')}
                </p>
                <button
                    onClick={() => setShowBudget(!showBudget)}
                    className={`mt-4 px-6 py-3 rounded-full font-bold transition flex items-center gap-2 mx-auto md:mx-0 shadow-lg ${showBudget ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-gray-700'}`}
                >
                    💰 {showBudget ? 'Disable Budget Mode' : 'Enable Student Budget Mode (Under ₹100)'}
                </button>
            </header>

            <div className="h-1 bg-green-600/10 rounded-full w-24"></div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 glass rounded-[2.5rem] space-y-4">
                    <span className="text-6xl">🔍</span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('products.no_found')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('products.search_something')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                    {filteredProducts.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group relative bg-white dark:bg-gray-800 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col h-full animate-fade-in-up mx-2 md:mx-0">
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 font-bold"
                                />
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-green-900 flex items-center gap-1.5 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        {product.category}
                                    </div>
                                    {product.isSeasonal && (
                                        <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {t('product_detail.limitless')}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className="absolute bottom-6 right-6 bg-green-600 text-white p-4 rounded-2xl shadow-xl transform translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-green-700 scale-110 active:scale-95"
                                    title={t('products.quick_add')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 md:p-8 flex flex-col flex-grow space-y-4">
                                <div>
                                    <h3 className="font-extrabold text-2xl text-green-950 dark:text-white tracking-tighter group-hover:text-green-600 transition truncate">{product.name}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">{t('products.source')}: {product.source || 'Direct Farm'}</p>
                                </div>

                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t('products.village_price')}</span>
                                        <span className="text-3xl font-black text-green-700 tracking-tighter">₹{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full">
                                        <span className="text-yellow-500 text-xs font-black">★</span>
                                        <span className="text-yellow-700 text-xs font-black">{product.rating || '4.5'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
