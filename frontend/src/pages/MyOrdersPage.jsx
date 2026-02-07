import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const MyOrdersPage = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Review State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [selectedItemForReview, setSelectedItemForReview] = useState(null);

    const [cancelReason, setCancelReason] = useState('');
    const [returnReason, setReturnReason] = useState('');
    const [returnImage, setReturnImage] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { token: 'mock-token' };
            const demoOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');

            try {
                const response = await fetch(`${config.API_URL}/api/orders/myorders`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('API Error');
                }

                const data = await response.json();
                // Combine with demo orders
                const totalOrders = [...data, ...demoOrders];
                totalOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(totalOrders);
            } catch (err) {
                console.error('Error fetching orders (Showing Demo Orders):', err);
                setOrders(demoOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelClick = (order) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
        setCancelReason('');
    };

    const handleReturnClick = (order) => {
        setSelectedOrder(order);
        setShowReturnModal(true);
        setReturnReason('');
        setReturnImage(null);
    };

    const handleViewDetailsClick = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleReviewClick = (item) => {
        setSelectedItemForReview(item);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    const submitReviewHandler = async () => {
        if (!selectedItemForReview) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${config.API_URL}/api/products/${selectedItemForReview.product}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }

            alert(t('orders.submit_success') || 'Review Submitted Successfully!');
            setShowReviewModal(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch(`${config.API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const imagePath = await res.text();
            setReturnImage(imagePath);
        } catch (error) {
            console.error(error);
            alert('Image upload failed');
        }
    };

    const confirmReturnOrder = async () => {
        if (!returnReason || !returnImage) {
            alert('Please provide a reason and upload an image');
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${config.API_URL}/api/orders/${selectedOrder._id}/return`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ reason: returnReason, image: returnImage })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to return order');
            }

            // Refresh orders logic
            const updatedOrders = orders.map(o =>
                o._id === selectedOrder._id ? { ...o, isReturned: true, returnReason: returnReason } : o
            );
            setOrders(updatedOrders);
            setShowReturnModal(false);
            alert(t('orders.request_success') || 'Return Requested Successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    const confirmCancelOrder = async () => {
        if (!cancelReason) {
            alert('Please select a reason for cancellation');
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await fetch(`${config.API_URL}/api/orders/${selectedOrder._id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to cancel order');
            }

            // Refresh orders logic
            const updatedOrders = orders.map(o =>
                o._id === selectedOrder._id ? { ...o, isCancelled: true, cancellationReason: cancelReason } : o
            );
            setOrders(updatedOrders);
            setShowCancelModal(false);
            alert(t('orders.cancel_success') || 'Order Cancelled Successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <Link to="/login" className="text-green-600 font-bold hover:underline">Login Again</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-2 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 md:mb-8 px-2 md:px-0">
                    <h1 className="text-3xl font-bold text-gray-900">{t('orders.title')}</h1>
                    <Link to="/profile" className="text-green-600 hover:text-green-800 font-medium">
                        &larr; {t('orders.back')}
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-green-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orders.no_orders')}</h2>
                        <p className="text-gray-500 mb-8">{t('orders.no_orders_desc')}</p>
                        <Link to="/products" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition transform hover:-translate-y-1">
                            {t('orders.start')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col justify-between mx-1 md:mx-0">
                                <div className="p-4 md:p-6 cursor-pointer" onClick={() => handleViewDetailsClick(order)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{t('orders.id')}</p>
                                            <p className="text-sm font-bold text-gray-700 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${order.isCancelled ? 'bg-red-100 text-red-700' : order.isReturned ? 'bg-orange-100 text-orange-700' : order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.isCancelled ? t('orders.cancelled') : order.isReturned ? t('orders.returned') : order.isPaid ? t('orders.paid') : t('orders.pending')}
                                            </span>
                                            {order.isCancelled && <span className="text-xs text-red-500">{t('orders.reason')}: {order.cancellationReason}</span>}
                                            {order.isReturned && <span className="text-xs text-orange-500">{t('orders.reason')}: {order.returnReason}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {order.orderItems.slice(0, 3).map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-md border border-gray-100" />
                                                ) : (
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{t('orders.qty')}: {item.qty}</p>
                                                </div>
                                                <span className="font-bold text-gray-700 text-sm">₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <p className="text-xs text-center text-gray-400 font-medium pt-2 border-t border-gray-50">
                                                {t('orders.more').replace('{count}', order.orderItems.length - 3)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 md:px-6 py-4 flex justify-between items-center border-t border-gray-100 h-20">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-400">{t('orders.total')}</p>
                                        <p className="text-xl font-bold text-green-700">₹{order.totalPrice}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleViewDetailsClick(order)}
                                            className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-white transition"
                                            title="View Details"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {!order.isCancelled && !order.isDelivered && (
                                            <button
                                                onClick={() => handleCancelClick(order)}
                                                className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                                            >
                                                {t('orders.cancel')}
                                            </button>
                                        )}
                                        {!order.isCancelled && order.isDelivered && !order.isReturned && (
                                            <button
                                                onClick={() => handleReturnClick(order)}
                                                className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-200 transition"
                                            >
                                                {t('orders.return_btn')}
                                            </button>
                                        )}
                                        <Link
                                            to={`/track/${order._id}`}
                                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-green-700 transition"
                                        >
                                            {t('orders.track')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Details Modal (New) */}
                {showDetailsModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{t('orders.details')}</h2>
                                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Status Bar */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">ID: #{selectedOrder._id}</span>
                                    <span className={`px-3 py-1 rounded text-sm font-bold ${selectedOrder.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {t('orders.payment')}: {selectedOrder.isPaid ? t('orders.paid') : t('orders.pending')}
                                    </span>
                                    <span className={`px-3 py-1 rounded text-sm font-bold ${selectedOrder.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {t('orders.delivery')}: {selectedOrder.isDelivered ? t('orders.delivered') : t('orders.processing')}
                                    </span>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">{t('orders.items')}</h3>
                                    <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                                        {selectedOrder.orderItems.map((item, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.image} className="w-10 h-10 object-cover rounded bg-white" alt="" />
                                                    <div>
                                                        <p className="text-sm font-semibold">{item.name}</p>
                                                        <p className="text-xs text-gray-500">{t('orders.qty')}: {item.qty}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm">₹{item.price * item.qty}</span>
                                                {selectedOrder.isDelivered && (
                                                    <button
                                                        onClick={() => handleReviewClick(item)}
                                                        className="ml-4 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold hover:bg-yellow-200 transition"
                                                    >
                                                        {t('orders.review')}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address & Payment Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <h3 className="font-bold text-blue-800 text-sm mb-2">{t('checkout.shipping')}</h3>
                                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl">
                                        <h3 className="font-bold text-purple-800 text-sm mb-2">{t('orders.payment')} {t('checkout.payment_desc').includes('payment') ? 'Info' : 'जानकारी'}</h3>
                                        <p className="text-sm text-gray-600">{t('checkout.payment')}: <span className="font-medium">{selectedOrder.paymentMethod}</span></p>
                                        {selectedOrder.isPaid && <p className="text-sm text-gray-600">{t('orders.paid')} {t('checkout.payment_desc').includes('payment') ? 'At' : 'को'}: {new Date(selectedOrder.paidAt).toLocaleDateString()}</p>}
                                        <div className="mt-2 pt-2 border-t border-purple-200">
                                            <div className="flex justify-between text-sm"><span>{t('checkout.items')}:</span> <span>₹{selectedOrder.itemsPrice}</span></div>
                                            <div className="flex justify-between text-sm"><span>{t('checkout.shipping_fee')}:</span> <span>₹{selectedOrder.shippingPrice}</span></div>
                                            <div className="flex justify-between text-sm"><span>{t('checkout.tax')}:</span> <span>₹{selectedOrder.taxPrice}</span></div>
                                            <div className="flex justify-between font-bold text-purple-900 mt-1"><span>{t('cart.total')}:</span> <span>₹{selectedOrder.totalPrice}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900"
                                >
                                    {t('orders.close')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">{t('orders.cancel_order')}</h2>
                            <p className="text-gray-600 mb-4">{t('orders.cancel_prompt')}</p>

                            <div className="space-y-3 mb-6">
                                {['Changed my mind', 'Found a better price', 'Delivery time is too long', 'Product not required anymore', 'Quality concerns'].map((reason) => (
                                    <label key={reason} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="cancelReason"
                                            value={reason}
                                            checked={cancelReason === reason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    {t('orders.close')}
                                </button>
                                <button
                                    onClick={confirmCancelOrder}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md"
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Return Modal */}
                {showReturnModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">{t('orders.return_order')}</h2>
                            <p className="text-gray-600 mb-4">{t('orders.return_prompt')}</p>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">{t('orders.upload')}</label>
                                <input
                                    type="file"
                                    onChange={uploadFileHandler}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                {returnImage && <p className="text-green-600 text-xs mt-1">{t('orders.upload_success')}</p>}
                            </div>

                            <div className="space-y-3 mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">{t('orders.reason')}</label>
                                {['Damaged Product', 'Wrong Item', 'Quality Issue', 'Expired Product'].map((reason) => (
                                    <label key={reason} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="returnReason"
                                            value={reason}
                                            checked={returnReason === reason}
                                            onChange={(e) => setReturnReason(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    {t('orders.close')}
                                </button>
                                <button
                                    onClick={confirmReturnOrder}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-md"
                                >
                                    Request Return
                                </button>
                            </div>
                        </div>
                    </div>

                )}

                {/* Review Modal */}
                {showReviewModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60 p-4" style={{ zIndex: 60 }}>
                        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full">
                            <h2 className="text-xl font-bold mb-4 text-green-800">{t('orders.rate')}</h2>
                            <p className="font-medium text-gray-700 mb-4">{selectedItemForReview?.name}</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('orders.rating')}</label>
                                    <select
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg focus:ring-green-500 bg-gray-50"
                                    >
                                        <option value="5">5 - {t('orders.rating_5')}</option>
                                        <option value="4">4 - {t('orders.rating_4')}</option>
                                        <option value="3">3 - {t('orders.rating_3')}</option>
                                        <option value="2">2 - {t('orders.rating_2')}</option>
                                        <option value="1">1 - {t('orders.rating_1')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('orders.comment')}</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:ring-green-500 bg-gray-50 h-24"
                                        placeholder={t('orders.quality_placeholder')}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitReviewHandler}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md"
                                >
                                    {t('orders.submit')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default MyOrdersPage;
