import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Mail } from 'lucide-react';

const AdminArtisans = () => {
    const [artisans, setArtisans] = useState([]);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const { data } = await axios.get('/api/auth/artisans', { withCredentials: true });
                setArtisans(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchArtisans();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Verified Artisans Sync</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-sm">
                        <tr>
                            <th className="p-4">Artisan Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {artisans.map(a => (
                            <tr key={a._id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3 font-semibold text-gray-800">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center"><Briefcase size={20}/></div>
                                    {a.name}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2"><Mail size={16}/> {a.email}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs uppercase tracking-widest font-bold">Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminArtisans;
