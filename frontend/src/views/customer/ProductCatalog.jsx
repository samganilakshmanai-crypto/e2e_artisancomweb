import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, User, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import axios from 'axios';

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { cartItems, addToCart } = useCartStore();
    const { wishlistItems, toggleWishlist } = useWishlistStore();
    
    useEffect(() => {
        axios.get('/api/products').then(({data}) => setProducts(data));
    }, []);

    const isInCart = (productId) => cartItems.some(item => item._id === productId);
    const isInWishlist = (productId) => wishlistItems.some(item => item._id === productId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-xl font-bold text-gray-800">Explore Artisan Catalog</h1>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No products available in catalogue yet. Wait for an artisan to list an item.</p>
                    </div>
                ) : products.map(product => (
                    <div 
                        key={product._id} 
                        onClick={() => navigate(`/dashboard/products/${product._id}`)}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-brand-300 transition-all flex flex-col cursor-pointer relative"
                    >
                        {/* Wishlist Heart Overlay */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform"
                        >
                            <Heart size={20} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                        </button>

                        <div className="h-48 bg-gray-100 w-full relative" onClick={(e) => e.stopPropagation()}>
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none" />
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                            <p className="text-xs text-brand-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</p>
                            <h3 className="font-semibold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1 mb-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200 w-fit">
                                <User size={12} className="text-gray-400" />
                                <p className="text-xs text-gray-600 font-medium truncate">By: {product.artisanId?.businessName || product.artisanId?.name || 'Local Artisan'}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                <p className="text-gray-900 font-bold text-lg">₹{product.price}</p>
                                
                                {!isInCart(product._id) ? (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart({ ...product, quantity: 1 });
                                        }}
                                        className="text-brand-600 hover:text-white bg-brand-50 hover:bg-brand-600 p-2.5 rounded-xl transition-colors shadow-sm"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                ) : (
                                    <div className="text-green-600 bg-green-50 p-2.5 rounded-xl shadow-sm">
                                        <CheckCircle2 size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ProductCatalog;
