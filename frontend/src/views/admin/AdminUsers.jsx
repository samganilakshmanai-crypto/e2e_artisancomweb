import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/auth/customers', { withCredentials: true });
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Global Customer Sync</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-sm">
                        <tr>
                            <th className="p-4">User Identity</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Join Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3 font-semibold text-gray-800">
                                    <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded flex items-center justify-center"><User size={20}/></div>
                                    {u.name}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2"><Mail size={16}/> {u.email}</td>
                                <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminUsers;
