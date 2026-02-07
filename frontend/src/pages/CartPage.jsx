import { useContext } from 'react';
import CartContext from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import PaymentHandler from '../components/PaymentHandler';
import { useLanguage } from '../context/LanguageContext';

const CartPage = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('cart.empty')}</h2>
                <Link to="/products" className="text-green-600 dark:text-green-400 hover:underline">{t('cart.go_shopping')}</Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 dark:text-white">{t('cart.title')}</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                                <div>
                                    <h3 className="font-bold dark:text-white">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">₹{item.price} x {item.qty}</p>

                                    {/* Customization Display */}
                                    {item.customization && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {item.customization.spice && <span className="block">🌶️ {t('product_detail.spice_level')}: {t(`product_detail.${item.customization.spice.toLowerCase()}`)}</span>}
                                            {item.customization.addOns && item.customization.addOns.length > 0 && (
                                                <span className="block">➕ {item.customization.addOns.map(a => a.name).join(', ')}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="block font-bold text-lg dark:text-white">₹{item.price * item.qty}</span>
                                    {item.customization?.addOns?.length > 0 && <span className="text-xs text-green-600 dark:text-green-400">{t('cart.extra')}</span>}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="md:w-1/3">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4 border dark:border-gray-700">
                        <h2 className="text-xl font-bold border-b dark:border-gray-700 pb-4 dark:text-white">{t('cart.summary')}</h2>
                        <div className="flex justify-between text-lg dark:text-gray-300">
                            <span>{t('cart.total')}</span>
                            <span className="font-bold dark:text-white">₹{total}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                        >
                            {t('cart.proceed')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
