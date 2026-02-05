import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import PaymentHandler from '../components/PaymentHandler';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false); // Added for UI feedback
    const [scheduledFor, setScheduledFor] = useState(null);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Location Detection
    const getLocation = () => { // Function is named getLocation
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Using OpenStreetMap Nominatim API for reverse geocoding
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

                if (data && data.address) {
                    setShippingAddress(prev => ({
                        ...prev,
                        address: data.display_name,
                        city: data.address.city || data.address.town || data.address.village || '',
                        postalCode: data.address.postcode || '',
                        country: data.address.country || 'India' // Default to India if not found
                    }));
                }
                alert(t('checkout.address_saved'));
            } catch (error) {
                console.error(error);
                alert('Failed to detect address manually. Please fill details.');
            } finally {
                setLoading(false);
            }
        }, () => {
            alert('Unable to retrieve your location');
            setLoading(false);
        });
    };

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% Tax
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (cartItems.length === 0 && !orderPlaced) { // Only redirect if cart is empty and order not placed
            navigate('/cart');
        }
    }, [cartItems, navigate, orderPlaced]);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Debug: Log payload
        console.log("Preparing Order Data...");

        // Manual Validation
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert('Please fill in all address fields.');
            setLoading(false);
            return;
        }

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.qty,
                customization: item.customization
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            scheduledFor
        };

        console.log("Order Data:", orderData);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token || 'mock-token-123'; // Demo fallback token

            console.log("Sending Order Request to:", `${config.API_URL}/api/orders`);
            const response = await fetch(`${config.API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Server Error');
            }

            const createdOrder = await response.json();
            setOrderId(createdOrder._id);
            setOrderPlaced(true);

            if (paymentMethod === 'COD') {
                clearCart();
                alert(t('checkout.success_cod'));
                navigate('/myorders');
            }

        } catch (error) {
            console.error('Order creation failed (Using Demo Mode):', error);

            // DEMO MODE SUCCESS FALLBACK
            const mockOrderId = 'order_' + Math.random().toString(36).substr(2, 9);
            const mockOrder = {
                ...orderData,
                _id: mockOrderId,
                isPaid: paymentMethod === 'COD' ? false : true,
                isDelivered: false,
                createdAt: new Date().toISOString()
            };

            // Save to LocalStorage so MyOrdersPage can show it
            const existingOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
            localStorage.setItem('demoOrders', JSON.stringify([mockOrder, ...existingOrders]));

            setOrderId(mockOrderId);
            setOrderPlaced(true);

            if (paymentMethod === 'COD') {
                clearCart();
                alert("Demo Mode: Order Placed Successfully (COD)");
                navigate('/myorders');
            } else {
                alert("Demo Mode: Order Created. Please complete mock payment below.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentDetails) => {
        clearCart();
        alert('Payment Successful! Order Confirmed.');
        navigate('/myorders');
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return <div className="p-10 text-center">{t('cart.empty')}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-green-900 border-b pb-2">{t('checkout.title')}</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Form */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">{t('checkout.shipping')}</h2>
                    <form className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-gray-700">{t('checkout.address')}</label>
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    className="text-green-600 text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    {locating ? t('checkout.detecting') : `📍 ${t('checkout.use_location')}`}
                                </button>
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                disabled={orderPlaced}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-1">{t('checkout.city')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    disabled={orderPlaced}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('checkout.postal')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    disabled={orderPlaced}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">{t('checkout.country')}</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                disabled={orderPlaced}
                            />
                        </div>

                        {/* Pre-Order / Schedule Delivery */}
                        <div className="mt-4 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">{t('checkout.timing')}</h3>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="deliveryTiming"
                                        className="accent-green-600"
                                        checked={!scheduledFor}
                                        onChange={() => setScheduledFor(null)}
                                    />
                                    <span>{t('checkout.deliver_now')}</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="deliveryTiming"
                                        className="accent-green-600"
                                        checked={!!scheduledFor}
                                        onChange={() => setScheduledFor(new Date().toISOString().slice(0, 16))}
                                    />
                                    <span>{t('checkout.schedule')}</span>
                                </label>
                            </div>
                            {scheduledFor && (
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                                    value={scheduledFor}
                                    min={new Date().toISOString().slice(0, 16)}
                                    onChange={(e) => setScheduledFor(e.target.value)}
                                    required
                                />
                            )}
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">{t('checkout.payment')}</h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={orderPlaced}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-900 font-medium">{t('checkout.cod')}</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Razorpay"
                                        checked={paymentMethod === 'Razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={orderPlaced}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-900 font-medium">{t('checkout.card')}</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="UPI"
                                        checked={paymentMethod === 'UPI'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={orderPlaced}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-900 font-medium">{t('checkout.upi')}</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="QR_Code"
                                        checked={paymentMethod === 'QR_Code'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={orderPlaced}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-900 font-medium">{t('checkout.qr')}</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Netbanking"
                                        checked={paymentMethod === 'Netbanking'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={orderPlaced}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-900 font-medium">{t('checkout.netbanking')}</span>
                                </label>
                            </div>
                        </div>

                        {!orderPlaced ? (
                            <button
                                type="button"
                                onClick={handleCreateOrder}
                                className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition mt-4"
                                disabled={loading}
                            >
                                {loading ? t('checkout.creating') : t('checkout.place_order')}
                            </button>
                        ) : (
                            <div className="bg-green-100 p-4 text-green-800 rounded mt-4 border border-green-300">
                                {paymentMethod === 'COD'
                                    ? <p className="font-bold text-lg">{t('checkout.success_cod')}</p>
                                    : <div className="text-center">
                                        <p className="font-bold text-lg mb-2">{t('checkout.address_saved')}</p>
                                        <p className="animate-pulse font-semibold">{t('checkout.payment_desc')} {window.innerWidth < 768 ? 'below' : 'on the right'} &rarr;</p>
                                    </div>
                                }
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 p-4 text-red-800 rounded mt-4 border border-red-200">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Side - Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('cart.summary')}</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>{t('checkout.items')}:</span> <span>₹{itemsPrice}</span></div>
                        <div className="flex justify-between"><span>{t('checkout.shipping_fee')}:</span> <span>₹{shippingPrice}</span></div>
                        <div className="flex justify-between"><span>{t('checkout.tax')}:</span> <span>₹{taxPrice}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>{t('cart.total')}:</span> <span>₹{totalPrice}</span>
                        </div>
                    </div>

                    {orderPlaced && orderId && (paymentMethod === 'Razorpay' || paymentMethod === 'Netbanking' || paymentMethod === 'Cards') && (
                        <PaymentHandler
                            amount={totalPrice}
                            orderId={orderId}
                            paymentMethod={paymentMethod}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    )}

                    {orderPlaced && orderId && (paymentMethod === 'UPI' || paymentMethod === 'QR_Code') && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-center">
                            <h3 className="font-bold text-lg mb-2 text-green-800">{t('checkout.scan_pay')}</h3>
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${config.UPI_ID}&pn=Dharti Ka Swad&cu=INR&am=${totalPrice}`)}`}
                                    alt="Scan to Pay"
                                    className="w-48 h-48 object-contain border-2 border-green-500 rounded-lg"
                                />
                            </div>
                            <p className="font-medium mb-1">UPI ID: <span className="text-blue-600 select-all">{config.UPI_ID}</span></p>
                            <p className="text-sm text-gray-600 mb-4">Scan using Google Pay, PhonePe, Paytm, or BHIM.</p>

                            <div className="flex flex-col gap-2">
                                <a
                                    href={`upi://pay?pa=${config.UPI_ID}&pn=Dharti%20Ka%20Swad&cu=INR&am=${totalPrice}`}
                                    className="block w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
                                >
                                    {t('checkout.open_upi')}
                                </a>
                                <button
                                    onClick={async () => {
                                        console.log("Processing Manual Payment Confirmation...");
                                        if (!window.confirm("Did you scan the QR and complete the payment?")) return;
                                        setLoading(true);
                                        try {
                                            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                            const token = userInfo?.token || 'mock-token';

                                            const res = await fetch(`${config.API_URL}/api/orders/${orderId}/pay`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: `Bearer ${token}`
                                                },
                                                body: JSON.stringify({
                                                    id: 'MANUAL_UPI_' + Date.now(),
                                                    status: 'manual_success',
                                                    update_time: new Date().toISOString(),
                                                    email_address: userInfo?.email
                                                })
                                            });

                                            if (res.ok) {
                                                alert('Payment Verified! Redirecting to Orders...');
                                                handlePaymentSuccess({ status: 'manual_success' });
                                            } else {
                                                throw new Error('Server Error');
                                            }
                                        } catch (err) {
                                            console.error("Payment Confirmation Error (Using Demo Mode):", err);

                                            // DEMO MODE PAYMENT SUCCESS FALLBACK
                                            const demoOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
                                            const updatedOrders = demoOrders.map(o =>
                                                o._id === orderId ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o
                                            );
                                            localStorage.setItem('demoOrders', JSON.stringify(updatedOrders));

                                            alert('Demo Mode: Payment Verified Locally!');
                                            handlePaymentSuccess({ status: 'demo_success' });
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="block w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {loading ? t('checkout.confirming') : t('checkout.paid_btn')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
