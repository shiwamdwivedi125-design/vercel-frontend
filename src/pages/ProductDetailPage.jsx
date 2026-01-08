import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import config from '../config';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { t } = useLanguage();
    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);

    const [spiceLevel, setSpiceLevel] = useState('Medium');
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/products/${id}`);
                if (!res.ok) {
                    throw new Error('Product not found');
                }
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message === 'Product not found' ? t('product_detail.not_found') : err.message);
                console.error("Product Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);



    const toggleAddOn = (addon) => {
        if (selectedAddOns.find(a => a.name === addon.name)) {
            setSelectedAddOns(selectedAddOns.filter(a => a.name !== addon.name));
        } else {
            setSelectedAddOns([...selectedAddOns, addon]);
        }
    };

    const handleAddToCart = () => {
        console.log("ProductDetail: Handle Add To Cart Clicked");
        if (!product) {
            console.error("ProductDetail: Product is null");
            return;
        }

        const customization = {
            spice: product.customization?.spiceLevel ? spiceLevel : null,
            addOns: selectedAddOns
        };
        // Calculate total price including add-ons
        const addOnPrice = selectedAddOns.reduce((acc, item) => acc + item.price, 0);
        const finalPrice = product.price + addOnPrice;

        console.log("ProductDetail: Calling addToCart with", { ...product, price: finalPrice, customization }, qty);
        addToCart({ ...product, price: finalPrice, customization }, Number(qty));
        alert(t('product_detail.added_alert'));
    };

    if (loading) return <div className="p-10 text-center animate-pulse">{t('farmers.loading')}</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
    if (!product) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('product_detail.not_found')}</h2>
            <p className="text-gray-600">{t('product_detail.removed')}</p>
            <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition">
                {t('product_detail.return_home')}
            </Link>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
            <div className="md:w-1/2">
                <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-lg object-cover max-h-[500px]" />
            </div>
            <div className="md:w-1/2 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                                {product.source || t('product_detail.farm_fresh')}
                            </span>
                            {product.isSeasonal && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                                    {t('product_detail.seasonal')}
                                </span>
                            )}
                            {product.isCombo && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                                    {t('product_detail.combo')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-green-600">₹{product.price}</div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full border border-yellow-300 flex items-center gap-1">
                            🪙 {t('product_detail.desi_coins').replace('{count}', Math.ceil(product.price / 10))}
                        </span>
                    </div>
                </div>

                <p className="text-xl text-gray-500">
                    {t('product_detail.by')} <span className="font-semibold text-green-700">{product.farmer?.name || 'Ram Singh'}</span>
                    {product.farmer?.village && <span> ({product.farmer.village})</span>}
                </p>

                {/* Farmer Story & Transparency Badge */}
                <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <img
                        src={product.farmer?.image || '/images/default_farmer.jpg'}
                        alt={product.farmer?.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-green-100"
                    />
                    <div>
                        <h3 className="font-black text-green-950 tracking-tighter">{t('product_detail.meet_farmer').replace('{name}', product.farmer?.name || 'Your Farmer')}</h3>
                        <p className="text-green-600 text-xs font-bold uppercase tracking-widest">{t('products.source')}: {product.farmer?.village || 'Local Farm'}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">👩‍🌾</span> {t('product_detail.story')}
                    </h3>
                    <p className="text-gray-600 font-medium italic leading-relaxed">
                        "{product.farmer?.bio || product.story || "I have been growing organic food using traditional cow-based farming methods. This product is harvested fresh for you."}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-500 border border-gray-200 shadow-sm">📍 {t('product_detail.verified')}</span>
                        <span className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-500 border border-gray-200 shadow-sm">🌱 {t('product_detail.no_chemicals')}</span>
                        <span className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-500 border border-gray-200 shadow-sm">🚜 {t('product_detail.traditional')}</span>
                    </div>
                </div>

                {/* QR Traceability Mockup */}
                <div className="border border-green-200 rounded-xl p-4 flex items-center gap-4 bg-green-50/50">
                    <div className="bg-white p-2 rounded shadow-sm">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=TraceabilityInfoFor_${product._id}`} alt="QR Code" className="w-16 h-16" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-green-800">{t('product_detail.scan_trace')}</p>
                        <p className="text-xs text-green-700 mt-1">{t('product_detail.trace_desc')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('product_detail.harvested')}: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>

                {/* Nutrition Info */}
                {product.nutrition && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2">{t('product_detail.nutrition')}</h3>
                        <div className="flex gap-4 text-sm text-blue-700">
                            {product.nutrition.calories && <span>🔥 {product.nutrition.calories} {t('product_detail.calories')}</span>}
                            {product.nutrition.protein && <span>💪 {product.nutrition.protein}{t('product_detail.protein')}</span>}
                            {product.nutrition.fats && <span>🥥 {product.nutrition.fats}{t('product_detail.fats')}</span>}
                        </div>
                    </div>
                )}

                {/* Ingredients */}
                {product.ingredients && product.ingredients.length > 0 && (
                    <div className="mt-2">
                        <h4 className="font-semibold text-gray-700 mb-1">{t('product_detail.ingredients')}:</h4>
                        <div className="flex flex-wrap gap-2">
                            {product.ingredients.map((ing, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border">{ing}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Authentic Village Recipe Video */}
                {product.recipeUrl && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-red-600 text-2xl">📺</span>
                            {t('product_detail.authentic_recipe')}
                        </h3>
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white">
                            <iframe
                                className="w-full h-full"
                                src={product.recipeUrl}
                                title={`${product.name} Recipe`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 italic flex items-center gap-2">
                            <span>✨</span> {t('product_detail.learn_tradition')}
                        </p>
                    </div>
                )}


                {/* Customization Section */}
                <div className="border-t border-b py-4 space-y-4">
                    {/* Spice Level */}
                    {product.customization?.spiceLevel && (
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">{t('product_detail.spice_level')}:</label>
                            <div className="flex gap-4">
                                {['Low', 'Medium', 'High'].map(level => (
                                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="spice"
                                            className="accent-green-600 w-5 h-5"
                                            checked={spiceLevel === level}
                                            onChange={() => setSpiceLevel(level)}
                                        />
                                        <span>{t(`product_detail.${level.toLowerCase()}`)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Ons */}
                    {product.customization?.addOns && product.customization.addOns.length > 0 && (
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">{t('product_detail.add_ons')}:</label>
                            <div className="space-y-2">
                                {product.customization.addOns.map((addon, idx) => (
                                    <label key={idx} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="accent-green-600 w-5 h-5"
                                                checked={selectedAddOns.some(a => a.name === addon.name)}
                                                onChange={() => toggleAddOn(addon)}
                                            />
                                            <span>{addon.name}</span>
                                        </div>
                                        <span className="text-gray-600">+₹{addon.price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <label className="font-semibold text-gray-700">{t('product_detail.quantity')}:</label>
                    <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        {[...Array(product.stock > 0 ? product.stock : 1).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-500">
                        ({product.stock} {t('product_detail.available')})
                    </span>
                </div>

                <div className="space-y-3">
                    {selectedAddOns.length > 0 && (
                        <div className="flex justify-between text-gray-600 bg-gray-50 p-3 rounded">
                            <span>{t('product_detail.base_price')}: ₹{product.price}</span>
                            <span>+ {t('product_detail.add_ons')}: ₹{selectedAddOns.reduce((a, c) => a + c.price, 0)}</span>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${product.stock > 0
                            ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                    >
                        {product.stock > 0 ? `${t('product_detail.add_to_cart')} - ₹${(product.price + selectedAddOns.reduce((a, c) => a + c.price, 0)) * qty}` : t('product_detail.out_of_stock')}
                    </button>
                    {product.stock > 0 && (
                        <button
                            onClick={() => {
                                handleAddToCart();
                                setTimeout(() => {
                                    navigate('/checkout');
                                }, 100);
                            }}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-orange-600 text-white hover:bg-orange-700 hover:shadow-xl transition shadow-lg"
                        >
                            {t('product_detail.buy_now')} 🚀
                        </button>
                    )}
                </div>

                {/* Delivery Schedule Info */}
                {product.availabilityTime && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        <span className="inline-block mr-1">🕒</span>
                        {t('product_detail.available_for')}: <strong>{product.availabilityTime}</strong>
                    </p>
                )}
            </div>

            {/* Reviews Section */}
            <div className="w-full md:w-full mt-12 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('product_detail.reviews')}</h2>

                {product.reviews.length === 0 && <p className="text-gray-500 italic">{t('product_detail.no_reviews')}</p>}

                <div className="space-y-6 mb-8">
                    {product.reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-800">{review.name}</span>
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>

                {/* Review Form */}

            </div>
        </div>
    );
};

export default ProductDetailPage;
