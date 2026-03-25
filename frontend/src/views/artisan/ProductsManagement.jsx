import { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

const ProductsManagement = () => {
    const { userInfo } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('1');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            const myProducts = data.filter(p => p.artisanId?._id === userInfo._id);
            setProducts(myProducts);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const newProduct = {
                name,
                price: Number(price),
                description,
                category,
                stock: Number(stock),
                images: [imageUrl || `https://source.unsplash.com/random/400x300/?craft,handmade,${Math.random()}`]
            };
            
            await axios.post('/api/products', newProduct, { withCredentials: true });
            
            setShowForm(false);
            setName(''); setPrice(''); setDescription(''); setCategory(''); setStock('1'); setImageUrl('');
            fetchProducts();
        } catch (error) {
            console.error('Failed to create product', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-xl font-bold text-gray-800">My Products</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    <span>{showForm ? 'Cancel' : 'List New Item'}</span>
                </button>
            </div>
            
            {showForm && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-lg font-bold mb-4">Add New Product Details</h2>
                    <form onSubmit={submitHandler} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="Leave empty for mock placeholder image" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                            <textarea required rows="4" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="Inform buyers about materials used, artisan origins..."></textarea>
                        </div>
                        <button type="submit" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 w-full mt-4">Save Product & Publish</button>
                    </form>
                </div>
            )}

            {!showForm && products.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-16 text-center text-gray-500 flex flex-col items-center">
                    <div className="text-5xl mb-4 bg-gray-50 p-4 rounded-full">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products listed</h3>
                    <p className="max-w-md mx-auto">Start showcasing your handcrafted goods to thousands of customers by adding your first product form above.</p>
                </div>
            )}

            {!showForm && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <img src={product.images[0]} alt={product.name} className="h-48 w-full object-cover" />
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                                    <p className="font-bold text-brand-600">₹{product.price}</p>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 py-2 rounded-lg bg-gray-50 hover:bg-brand-50 transition-colors">
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ProductsManagement;
