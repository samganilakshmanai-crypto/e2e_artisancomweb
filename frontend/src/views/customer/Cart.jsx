const Cart = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-4">
            <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🛒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't added any artisan products yet.</p>
                <button className="bg-brand-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};
export default Cart;
