import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Home, ShoppingBag, List, Users, Briefcase, Settings, LogOut, User } from 'lucide-react';

const Sidebar = () => {
    const { userInfo, logout } = useAuthStore();
    const location = useLocation();

    const getLinks = () => {
        if (userInfo?.role === 'admin') {
            return [
                { name: 'Overview', path: '/dashboard', icon: Home },
                { name: 'Users', path: '/dashboard/users', icon: Users },
                { name: 'Artisans', path: '/dashboard/artisans', icon: Briefcase },
                { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
                { name: 'Orders', path: '/dashboard/orders', icon: List },
            ];
        } else if (userInfo?.role === 'artisan') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: Home },
                { name: 'My Products', path: '/dashboard/products', icon: ShoppingBag },
                { name: 'Orders', path: '/dashboard/orders', icon: List },
                { name: 'QR Code', path: '/dashboard/qrcode', icon: Settings },
                { name: 'My Profile', path: '/dashboard/artisan-profile', icon: User },
            ];
        } else {
            return [
                { name: 'Catalog', path: '/dashboard', icon: ShoppingBag },
                { name: 'My Orders', path: '/dashboard/orders', icon: List },
                { name: 'Wishlist', path: '/dashboard/wishlist', icon: Home },
            ];
        }
    };

    return (
        <div className="w-64 bg-white shadow-lg h-screen flex flex-col justify-between hidden md:block transition-all duration-300 z-50">
            <div>
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-brand-600 tracking-tight">ArtisanMarket</h1>
                    {userInfo && (
                        <p className="text-sm font-medium text-gray-500 mt-1 capitalize">{userInfo.role} Area</p>
                    )}
                </div>
                <nav className="p-4 space-y-2 mt-4">
                    {getLinks().map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-brand-50 text-brand-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
