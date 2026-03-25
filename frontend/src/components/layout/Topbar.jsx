import { Bell, Search, User, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';

const Topbar = () => {
    const { userInfo } = useAuthStore();
    const { cartItems } = useCartStore();
    const { wishlistItems } = useWishlistStore();
    const navigate = useNavigate();

    return (
        <div className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 relative z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg hidden sm:block">
                {(userInfo?.role !== 'artisan' && userInfo?.role !== 'admin') && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products, artisans..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all text-sm outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-6 ml-auto">
                {(userInfo?.role !== 'admin' && userInfo?.role !== 'artisan') && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/dashboard/wishlist')} className="relative p-2 text-gray-500 hover:text-red-500 transition-colors group">
                            <Heart size={22} className={wishlistItems.length > 0 ? "fill-red-500 text-red-500" : ""} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1 shadow-sm">
                                    {wishlistItems.length}
                                </span>
                            )}
                            <span className="absolute top-10 right-0 w-max px-3 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">Saved Artifacts</span>
                        </button>

                        <button onClick={() => navigate('/dashboard/checkout')} className="relative p-2 text-gray-500 hover:text-brand-600 transition-colors group">
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-brand-600 text-white text-[10px] font-bold rounded-full border-2 border-white px-1 shadow-sm">
                                    {cartItems.length}
                                </span>
                            )}
                            <span className="absolute top-10 right-0 w-max px-3 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">Go to Checkout</span>
                        </button>
                    </div>
                )}

                <div className="relative group">
                    <button className="relative p-2 text-gray-500 hover:text-brand-600 transition-colors">
                        <Bell size={22} />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    {/* Functional Notification Dropdown */}
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">Notifications</div>
                        <div className="p-4 text-sm text-gray-500 flex flex-col gap-4">
                            <div className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                <div className="w-2 h-2 mt-1.5 bg-brand-500 rounded-full flex-shrink-0"></div>
                                <p>Welcome to Artisan Marketplace! Complete your full profile.</p>
                            </div>
                            <div className="flex gap-3 items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                                <p>System update scheduled for tomorrow.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border border-brand-200">
                        {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-700">{userInfo?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400 capitalize">{userInfo?.role || 'User'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
