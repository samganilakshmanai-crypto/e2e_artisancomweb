const CustomerDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium tracking-wide text-sm">RECENT ORDERS</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium tracking-wide text-sm">WISHLIST ITEMS</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium tracking-wide text-sm">CART ITEMS</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                </div>
            </div>
        </div>
    );
};
export default CustomerDashboard;
