import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, Trash2, ShoppingBag, ShieldAlert, BarChart3, AlertOctagon, Package, Eye } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ usersCount: 0, artisansCount: 0, flagsCount: 0 });
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [orders, setOrders] = useState([]);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, productsData, customersData, artisansData, ordersData] = await Promise.all([
                axios.get('/api/artisans/admin/stats', { withCredentials: true }),
                axios.get('/api/products'),
                axios.get('/api/auth/customers', { withCredentials: true }),
                axios.get('/api/auth/artisans', { withCredentials: true }),
                axios.get('/api/orders/all', { withCredentials: true })
            ]);

            setStats(statsData.data);
            setProducts(productsData.data);
            setCustomers(customersData.data);
            setArtisans(artisansData.data);
            setOrders(ordersData.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to permanently remove this product from the platform?")) {
            try {
                await axios.delete(`/api/products/${productId}`, { withCredentials: true });
                alert('Product removed successfully due to violations/feedback.');
                fetchDashboardData();
            } catch (err) {
                alert('Error removing product');
            }
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm("Are you sure you want to remove this customer from the platform? This action cannot be undone.")) {
            try {
                setDeleteLoading(customerId);
                await axios.delete(`/api/auth/users/${customerId}`, { withCredentials: true });
                alert('Customer removed successfully from the platform.');
                fetchDashboardData();
            } catch (err) {
                alert('Error removing customer');
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const handleDeleteArtisan = async (artisanId) => {
        if (window.confirm("Are you sure you want to remove this artisan from the platform? This action cannot be undone.")) {
            try {
                setDeleteLoading(artisanId);
                await axios.delete(`/api/auth/artisans/${artisanId}`, { withCredentials: true });
                alert('Artisan removed successfully from the platform.');
                fetchDashboardData();
            } catch (err) {
                alert('Error removing artisan');
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(
                `/api/orders/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            setOrders(orders.map(order => order._id === orderId ? data.order : order));
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const toggleProductStats = (id) => {
        setExpandedProductId(expandedProductId === id ? null : id);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-purple-50 text-purple-700 border-purple-200',
            delivered: 'bg-green-50 text-green-700 border-green-200',
            cancelled: 'bg-red-50 text-red-700 border-red-200'
        };
        return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'customers', label: 'Customers', icon: '👥' },
        { id: 'artisans', label: 'Artisans', icon: '🎨' },
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'products', label: 'Products', icon: '🛍️' }
    ];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Super Admin System Control Panel</h1>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-brand-600 text-brand-600 bg-brand-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24}/></div>
                            <div>
                                <h3 className="text-gray-500 font-medium tracking-wide text-xs">TOTAL CUSTOMERS</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.usersCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-brand-50 text-brand-600 rounded-lg"><Briefcase size={24}/></div>
                            <div>
                                <h3 className="text-gray-500 font-medium tracking-wide text-xs">TOTAL ARTISANS</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.artisansCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><ShoppingBag size={24}/></div>
                            <div>
                                <h3 className="text-gray-500 font-medium tracking-wide text-xs">TOTAL PRODUCTS</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{products.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center gap-4 border-l-4 border-l-red-500">
                            <div className="p-3 bg-red-50 text-red-500 rounded-lg"><AlertOctagon size={24}/></div>
                            <div>
                                <h3 className="text-gray-500 font-medium tracking-wide text-xs">REPORTED ISSUES</h3>
                                <p className="text-2xl font-bold text-red-500 mt-1">{stats.flagsCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-blue-700">{orders.length}</p>
                            <p className="text-sm text-blue-600 mt-2">Across all customers</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
                            <h3 className="text-lg font-bold text-green-900 mb-2">Total Revenue</h3>
                            <p className="text-3xl font-bold text-green-700">₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</p>
                            <p className="text-sm text-green-600 mt-2">From all orders</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Global Customer Management</h2>
                            <p className="text-sm text-gray-500 mt-1">{customers.length} {customers.length === 1 ? 'Customer' : 'Customers'} Total</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-max">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-semibold">
                                    <tr>
                                        <th className="p-4">User Identity</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Join Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {customers.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">No customers found</td>
                                        </tr>
                                    ) : (
                                        customers.map(u => (
                                            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 flex items-center gap-3 font-semibold text-gray-800">
                                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {u.name}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border ${
                                                        u.status === 'active' 
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteCustomer(u._id)}
                                                        disabled={deleteLoading === u._id}
                                                        className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} /> {deleteLoading === u._id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Artisans Tab */}
            {activeTab === 'artisans' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Verified Artisans Management</h2>
                            <p className="text-sm text-gray-500 mt-1">{artisans.length} {artisans.length === 1 ? 'Artisan' : 'Artisans'} Total</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-max">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-semibold">
                                    <tr>
                                        <th className="p-4">Artisan Name</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Join Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {artisans.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">No artisans found</td>
                                        </tr>
                                    ) : (
                                        artisans.map(a => (
                                            <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 flex items-center gap-3 font-semibold text-gray-800">
                                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center font-bold">
                                                        {a.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {a.name}
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded text-xs uppercase tracking-widest font-bold">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-500 text-sm">{new Date(a.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteArtisan(a._id)}
                                                        disabled={deleteLoading === a._id}
                                                        className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} /> {deleteLoading === a._id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Order Management Hub</h2>
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <p className="text-blue-700 font-semibold text-sm">{orders.length} Total Orders</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No orders in the system yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left min-w-max">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider font-semibold">
                                    <tr>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Items</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Payment</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map(order => (
                                        <React.Fragment key={order._id}>
                                            <tr className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}>
                                                <td className="p-4 font-bold text-gray-800 text-sm">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{order._id.substring(0, 10)}...</code>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-brand-100 text-brand-600 rounded flex items-center justify-center text-sm font-bold">
                                                            {order.customerId?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{order.customerId?.name || 'Unknown'}</p>
                                                            <p className="text-xs text-gray-500">{order.customerId?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold">{order.items.length}</span>
                                                </td>
                                                <td className="p-4 font-bold text-gray-800">₹{order.totalAmount.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                                                        order.paymentStatus === 'paid' 
                                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                        <Eye size={14} /> View
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedOrderId === order._id && (
                                                <tr className="bg-slate-50 border-b border-gray-200">
                                                    <td colSpan="7" className="p-6">
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</h4>
                                                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                        {order.items.map((item, idx) => (
                                                                            <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                                                                                <p className="font-medium text-gray-700">{item.name}</p>
                                                                                <p className="text-xs text-gray-600">₹{item.price} x {item.quantity}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Shipping</h4>
                                                                    <div className="text-sm space-y-1 text-gray-700">
                                                                        <p className="font-semibold">{order.shippingAddress?.street}</p>
                                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                                                        <p>{order.shippingAddress?.zip}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <p><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
                                                                        <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Update Status</h4>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {statusOptions.map(status => (
                                                                        <button
                                                                            key={status}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleStatusChange(order._id, status);
                                                                            }}
                                                                            className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                                                                                order.status === status
                                                                                    ? 'bg-gray-800 text-white border-gray-800'
                                                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            {status}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-800">Product Moderation & Feedback</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{products.length} Products Active</span>
                        </div>

                        {products.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">No products available in the system yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                            <th className="p-4 rounded-tl-lg font-semibold">Product Identity</th>
                                            <th className="p-4 font-semibold">Listed Price</th>
                                            <th className="p-4 font-semibold">Category</th>
                                            <th className="p-4 font-semibold">Artisan Owner</th>
                                            <th className="p-4 rounded-tr-lg font-semibold text-right">Moderator Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map(product => (
                                            <React.Fragment key={product._id}>
                                                <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => toggleProductStats(product._id)}>
                                                    <td className="p-4 font-bold text-gray-800 flex items-center gap-4">
                                                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                                                        {product.name}
                                                    </td>
                                                    <td className="p-4 text-gray-800 font-medium">₹{product.price}</td>
                                                    <td className="p-4 text-gray-500 font-medium"><span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-xs tracking-wider uppercase">{product.category}</span></td>
                                                    <td className="p-4 text-gray-500 font-medium">{product.artisanId?.name || product.artisanId?.businessName || 'Unknown'}</td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product._id); }} className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                                            <Trash2 size={16} /> Remove Listing
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedProductId === product._id && (
                                                    <tr className="bg-slate-50 border-b border-gray-200">
                                                        <td colSpan="5" className="p-6">
                                                            <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                                                    <div className="flex items-center gap-3 mb-2 text-gray-600">
                                                                        <BarChart3 size={18} /> <h4 className="font-semibold text-sm">Sales Velocity</h4>
                                                                    </div>
                                                                    <p className="text-2xl font-bold text-gray-800">{Math.floor(Math.random() * 50) + 2} Lifetime Sales</p>
                                                                    <p className="text-xs text-green-600 mt-1 font-medium">Trending higher this week</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                                                    <div className="flex items-center gap-3 mb-2 text-gray-600">
                                                                        <ShieldAlert size={18} /> <h4 className="font-semibold text-sm">Customer Complaints</h4>
                                                                    </div>
                                                                    <p className="text-2xl font-bold text-gray-800">{Math.floor(Math.random() * 4)} Quality Flags</p>
                                                                    <p className="text-xs text-orange-600 mt-1 font-medium">Including delivery/package issues</p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                                                                    <p className="text-sm tracking-wide text-gray-500 mb-2">MODERATION NOTES:</p>
                                                                    <p className="text-xs text-gray-600 italic">"If poor metrics continually aggregate for making delays or bad review feedback, use the Remove Listing action immediately to safeguard platform integrity."</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminDashboard;
