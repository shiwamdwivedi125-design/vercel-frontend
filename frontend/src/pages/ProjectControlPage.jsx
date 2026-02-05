import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaPlus, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';
import AddPartnerModal from '../components/AddPartnerModal';
import AssignPartnerModal from '../components/AssignPartnerModal';
import config from '../config';

const ProjectControlPage = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]); // New state for orders
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

    // Assign Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/api/products`);
            setProducts(data);
            setStats(prev => ({ ...prev, products: data.length }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const configObj = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            // Assuming we have an endpoint to list all orders for admin
            // If not, we might need to rely on what we have or create one. 
            // Previous analysis showed `getOrders` controller exists and is mounted at `/api/orders` (GET) for admin.
            const { data } = await axios.get(`${config.API_URL}/api/orders`, configObj);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const configObj = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const { data } = await axios.get(`${config.API_URL}/api/orders/stats`, configObj);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handlePartnerAdded = () => {
        alert("Partner Added!");
    };

    const handleProductAdded = () => {
        fetchProducts();
    };

    const openAssignModal = (id) => {
        setSelectedOrderId(id);
        setIsAssignModalOpen(true);
    };

    const handleAssignSuccess = () => {
        fetchOrders(); // Refresh to see updated partner info if we displayed it
    };

    useEffect(() => {
        fetchProducts();
        fetchStats();
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Project Control Dashboard</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsPartnerModalOpen(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow"
                        >
                            <FaPlus /> Add Delivery Partner
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow"
                        >
                            <FaPlus /> Add New Product
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.products}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <FaBoxOpen className="text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.orders}</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <FaShoppingCart className="text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-800">₹{stats.revenue}</h3>
                            </div>
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                <FaChartLine className="text-xl" />
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for more stats */}
                </div>

                {/* Active Orders Management Section (Zomato Style) */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-orange-100">
                    <div className="px-6 py-4 border-b border-orange-100 flex justify-between items-center bg-orange-50">
                        <h2 className="text-lg font-bold text-orange-900">Active Orders & Delivery Management</h2>
                        <span className="text-xs bg-white text-orange-600 px-2 py-1 rounded border border-orange-200">Action Required</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-orange-100 text-orange-800 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                    <th className="px-6 py-3 font-medium">User</th>
                                    <th className="px-6 py-3 font-medium">Total</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Partner</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {orders && orders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                        <td className="px-6 py-4">{order.user ? order.user.name : 'Guest'}</td>
                                        <td className="px-6 py-4 font-bold">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {order.deliveryPartner ? (
                                                <span className="text-green-600 font-bold flex items-center gap-1">
                                                    🛵 {order.deliveryPartner.name || 'Assigned'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!order.isDelivered && (
                                                <button
                                                    onClick={() => openAssignModal(order._id)}
                                                    className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition shadow-sm"
                                                >
                                                    Assign Partner
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Product Inventory</h2>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Live Data</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Product Name</th>
                                    <th className="px-6 py-3 font-medium">Category</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Stock</th>
                                    <th className="px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading inventory...</td></tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{product.category}</td>
                                            <td className="px-6 py-4 text-gray-900 font-semibold">₹{product.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {product.stock} Units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                                                <span className="mx-2 text-gray-300">|</span>
                                                <button className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onProductAdded={handleProductAdded}
                />

                <AddPartnerModal
                    isOpen={isPartnerModalOpen}
                    onClose={() => setIsPartnerModalOpen(false)}
                    onPartnerAdded={handlePartnerAdded}
                />

                <AssignPartnerModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    orderId={selectedOrderId}
                    onAssignSuccess={handleAssignSuccess}
                />
            </div>
        </div>
    );
};

export default ProjectControlPage;
