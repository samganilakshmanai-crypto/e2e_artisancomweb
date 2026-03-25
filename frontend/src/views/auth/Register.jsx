import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();
    const { register, userInfo } = useAuthStore();

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userData = { name, email, password, role };
            if (role === 'artisan') {
                userData.businessName = businessName;
                userData.description = description;
            }
            await register(userData);
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 px-4 md:px-0">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Join Us</h2>
                    <p className="text-gray-500">Create your account</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-400"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-400"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
                        <div className="flex gap-6 relative z-10">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="customer"
                                    checked={role === 'customer'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500 relative z-20"
                                    style={{position: 'relative', zIndex: 10}} // fixes react radio button tailwind bug
                                />
                                <span>Buy Products</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="artisan"
                                    checked={role === 'artisan'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500 relative z-20"
                                />
                                <span>Sell as Artisan</span>
                            </label>
                        </div>
                    </div>

                    {role === 'artisan' && (
                        <div className="space-y-4 pt-4 mt-2 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business / Shop Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    placeholder="Tell buyers about your craft..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 mt-2 rounded-xl transition-all shadow-lg shadow-brand-200"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
