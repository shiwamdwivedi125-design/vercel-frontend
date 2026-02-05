import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import config from '../config';
import { FaTimes, FaCheck, FaBoxOpen, FaTruck, FaMapMarkerAlt, FaStore } from 'react-icons/fa';

const OrderTrackingPage = () => {
    const { id } = useParams();
    const { userInfo } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = userInfo?.token || 'mock-token';
            const demoOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');

            try {
                const { data } = await axios.get(`${config.API_URL}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order (Checking Demo Orders):', err);
                // Fallback to demo orders
                const foundOrder = demoOrders.find(o => o._id === id);
                if (foundOrder) {
                    // Enrich with mock user if needed
                    const enrichedOrder = {
                        ...foundOrder,
                        user: foundOrder.user || { name: userInfo?.name || 'Demo User' }
                    };
                    setOrder(enrichedOrder);
                    setError(null);
                } else {
                    setError(err.response?.data?.message || err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, userInfo]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

    const steps = [
        { title: 'Confirmed', icon: <FaStore />, done: true },
        { title: 'Packed', icon: <FaBoxOpen />, done: order.isPaid || order.paymentMethod === 'Cash on Delivery' },
        { title: 'Shipped', icon: <FaTruck />, done: order.isDelivered },
        { title: 'Delivered', icon: <FaCheck />, done: order.isDelivered }
    ];

    // If cancelled, we modify the UI
    const isCancelled = order.isCancelled;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-green-950 tracking-tighter">
                        Track Order <span className="text-green-600">#{id.substring(id.length - 6).toUpperCase()}</span>
                    </h1>
                    <Link to="/myorders" className="bg-white px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-bold shadow-sm">
                        &larr; Back to Orders
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-soft overflow-hidden border border-gray-100">
                    {/* Status Header */}
                    {isCancelled && (
                        <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                            <div className="bg-red-500 text-white p-3 rounded-2xl shadow-lg">
                                <FaTimes className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-red-950 leading-none">Order Cancelled</h2>
                                <p className="text-red-700 font-bold mt-1 uppercase tracking-widest text-xs">Reason: {order.cancellationReason}</p>
                            </div>
                        </div>
                    )}

                    {/* Live Map Section (Only if not cancelled) */}
                    {!isCancelled && (
                        <div className="relative h-[400px] w-full bg-gray-200">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=77.20,28.60,77.25,28.65&layer=mapnik&marker=${28.61},${77.23}`}
                                title="Live Location"
                            ></iframe>
                            <div className="absolute top-8 left-8 glass px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 animate-fade-in">
                                <div className="h-4 w-4 bg-green-500 rounded-full animate-ping"></div>
                                <span className="font-black text-green-950 tracking-tighter text-lg uppercase">Locating Partner...</span>
                            </div>
                        </div>
                    )}

                    {/* Tracking Timeline */}
                    <div className="p-10 md:p-16">
                        <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute left-0 top-6 w-full h-1.5 bg-gray-100 overflow-hidden rounded-full">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${isCancelled ? 'bg-red-500 w-full opacity-30' : 'bg-green-500 w-1/2'}`}
                                ></div>
                            </div>

                            <div className="relative z-10 flex justify-between">
                                {steps.map((step, index) => {
                                    const isStepFailed = isCancelled && index >= 1; // Mark subsequent steps as failed
                                    return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div
                                                className={`h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-xl transition-all duration-500 shadow-lg ${isStepFailed
                                                    ? 'bg-red-100 text-red-500 border-2 border-red-200'
                                                    : step.done
                                                        ? 'bg-green-600 text-white border-2 border-white'
                                                        : 'bg-white text-gray-300 border-2 border-gray-100'
                                                    }`}
                                            >
                                                {isStepFailed ? <FaTimes /> : step.done ? <FaCheck /> : step.icon}
                                            </div>
                                            <div className="mt-6 text-center">
                                                <p className={`text-base font-black tracking-tighter uppercase ${isStepFailed ? 'text-red-500' : step.done ? 'text-green-950' : 'text-gray-400'}`}>
                                                    {step.title}
                                                </p>
                                                {isStepFailed && index === 1 && (
                                                    <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block animate-pulse">
                                                        OUT OF PRODUCT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Details Summary */}
                        <div className="mt-16 grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-green-950 tracking-tighter uppercase">Delivery Partner & Address</h3>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-gray-600 leading-relaxed font-medium">
                                <p className="font-bold text-gray-800">{order.user.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>

                                {/* Partner Info */}
                                {order.deliveryPartner && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
                                        <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center text-2xl">
                                            🛵
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-800 text-sm">Delivery Partner Assigned</p>
                                            <p className="text-gray-900 font-black text-lg">{order.deliveryPartner.name}</p>
                                            <p className="text-xs text-gray-500">{order.deliveryPartner.vehicle}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-green-950 tracking-tighter uppercase">Payment Info</h3>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Method</p>
                                    <p className="font-bold text-gray-800">{order.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                                    <p className="text-2xl font-black text-green-700">₹{order.totalPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
