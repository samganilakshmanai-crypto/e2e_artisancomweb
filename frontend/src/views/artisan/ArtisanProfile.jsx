import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Briefcase, FileText } from 'lucide-react';

const ArtisanProfile = () => {
    const [profile, setProfile] = useState({ businessName: '', description: '', workExperience: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        axios.get('/api/artisans/profile', { withCredentials: true })
             .then(({data}) => setProfile({ businessName: data.businessName, description: data.description, workExperience: data.workExperience || '' }))
             .catch(err => console.error(err));
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put('/api/artisans/profile', profile, { withCredentials: true });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <User size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">My Artisan Profile</h1>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" /> Business / Workshop Name
                        </label>
                        <input type="text" required value={profile.businessName} onChange={e => setProfile({...profile, businessName: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" /> Store Short Description
                        </label>
                        <textarea rows="3" required value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"></textarea>
                    </div>
                    <div className="pt-6 border-t border-gray-100 mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience & Portfolio details</label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed max-w-xl">Detail your craftsmanship journey, previous exhibitions, formal training, and the materials you use. The more customers know about you, the higher their trust will be.</p>
                        <textarea rows="6" value={profile.workExperience} onChange={e => setProfile({...profile, workExperience: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="I have over 10 years of experience making authentic pottery in..."></textarea>
                    </div>
                    
                    <div className="flex justify-end pt-8">
                        <button type="submit" disabled={isSaving} className="bg-brand-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                            {isSaving ? 'Saving...' : 'Save Profile Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArtisanProfile;
