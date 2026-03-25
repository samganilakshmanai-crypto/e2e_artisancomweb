import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, User, Mail, Eye, ArrowRight } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/orders/all', { withCredentials: true });
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
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

    if (loading) {
        return <div className="flex items-center justify-center py-12"><p className="text-gray-500">Loading orders...</p></div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Order Management Hub</h1>
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
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Current Status</th>
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
                                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {order.customerId?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold">{order.items.length} Item{order.items.length !== 1 ? 's' : ''}</span>
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
                                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</h4>
                                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                                                        <span className="text-gray-700 font-medium">{item.name}</span>
                                                                        <div className="text-right">
                                                                            <p className="font-bold text-gray-800">₹{item.price} x {item.quantity}</p>
                                                                            <p className="text-xs text-gray-500">Artisan: {item.artisanId?.name || 'Unknown'}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Shipping Address</h4>
                                                            <div className="text-sm space-y-1 text-gray-700">
                                                                <p className="font-semibold">{order.shippingAddress.street}</p>
                                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                                                <p>{order.shippingAddress.country}</p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Info</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><span className="font-semibold text-gray-700">Method:</span> <span className="text-gray-600">{order.paymentMethod}</span></p>
                                                                <p><span className="font-semibold text-gray-700">Date:</span> <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                                                {order.feedback && <p><span className="font-semibold text-gray-700">Feedback:</span> <span className="text-green-600">{order.feedback}</span></p>}
                                                                {order.issue && <p><span className="font-semibold text-gray-700">Issue:</span> <span className="text-red-600">{order.issue}</span></p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Update Order Status</h4>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-sm font-semibold text-gray-700">Change Status:</span>
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
                                                                                ? 'bg-gray-800 text-white border-gray-800 scale-105'
                                                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                                                        }`}
                                                                    >
                                                                        {status}
                                                                    </button>
                                                                ))}
                                                            </div>
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
    );
};

export default AdminOrders;
