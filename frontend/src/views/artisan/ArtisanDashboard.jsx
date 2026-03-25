import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Zap, TrendingUp } from 'lucide-react';

const ArtisanDashboard = () => {
    const [stats, setStats] = useState({ earnings: 0, pendingOrders: 0, totalProducts: 0, completedOrders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Fetch artisan orders seamlessly
                const { data: orders } = await axios.get('/api/orders/artisanorders', { withCredentials: true });
                const { data: products } = await axios.get('/api/products', { withCredentials: true });
                
                let totalEarnings = 0;
                let pendingCount = 0;
                let completedCount = 0;

                orders.forEach(order => {
                    if (order.status === 'pending' || order.status === 'processing') pendingCount++;
                    if (order.status === 'delivered') completedCount++;
                    order.items.forEach(item => {
                        totalEarnings += (item.price * item.quantity);
                    });
                });
                
                setStats({ earnings: totalEarnings, pendingOrders: pendingCount, totalProducts: products.length, completedOrders: completedCount });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-gray-800">Shop Overview & Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={24}/></div>
                    <div>
                        <h3 className="text-gray-500 font-medium tracking-wide text-xs">TOTAL EARNINGS</h3>
                        <p className="text-2xl font-bold text-green-600 mt-1">₹{stats.earnings.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Zap size={24}/></div>
                    <div>
                        <h3 className="text-gray-500 font-medium tracking-wide text-xs">PENDING ORDERS</h3>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pendingOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24}/></div>
                    <div>
                        <h3 className="text-gray-500 font-medium tracking-wide text-xs">COMPLETED ORDERS</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completedOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Package size={24}/></div>
                    <div>
                        <h3 className="text-gray-500 font-medium tracking-wide text-xs">LIVE PRODUCTS</h3>
                        <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-12 rounded-xl shadow-sm border border-brand-200 mt-8 text-center">
                <div className="text-6xl mb-4 opacity-80">📈</div>
                <h3 className="text-xl font-semibold text-brand-900 mb-2">Sales Analytics & Insights</h3>
                <p className="text-brand-700 font-medium mb-4">Track your orders and earnings from the MyOrders section. Your QR code payments need proper validation.</p>
                <a href="/myorders" className="inline-block bg-brand-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-700 transition-all shadow-sm">View Order Details</a>
            </div>
        </div>
    );
};
export default ArtisanDashboard;
