import { Upload } from 'lucide-react';
import axios from 'axios';

const UploadQR = () => {
    return (
        <div className="max-w-xl mx-auto space-y-6 mt-4">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-4 shadow-sm border border-brand-100">
                    <Upload size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Payment QR Code</h2>
                <p className="text-gray-500 mb-10 px-4">This QR code (e.g., Venmo, PayPal, UPI) will be displayed to customers selecting manual payment at checkout.</p>
                
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <p className="text-gray-500 group-hover:text-brand-600 font-medium">Click to select an image from your device</p>
                    <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                            const { data: imageUrl } = await axios.post('/api/upload', formData, { withCredentials: true });
                            await axios.put('/api/artisans/profile', { qrCodeImage: imageUrl }, { withCredentials: true });
                            alert('QR Code saved successfully!');
                        } catch(err) {
                            console.error(err);
                            alert('Failed to upload image.');
                        }
                    }} />
                </label>
            
                <p className="text-xs text-gray-400 mt-6 pt-6 border-t border-gray-100 w-full text-center">Supported formats: JPG, PNG. Max size: 2MB.</p>
            </div>
        </div>
    );
};
export default UploadQR;
