import { create } from 'zustand';

const useWishlistStore = create((set, get) => ({
    wishlistItems: JSON.parse(localStorage.getItem('wishlistItems')) || [],

    toggleWishlist: (product) => {
        let currentWishlist = get().wishlistItems;
        const exists = currentWishlist.find((item) => item._id === product._id);
        
        if (exists) {
            currentWishlist = currentWishlist.filter((item) => item._id !== product._id);
        } else {
            currentWishlist = [...currentWishlist, product];
        }
        
        localStorage.setItem('wishlistItems', JSON.stringify(currentWishlist));
        set({ wishlistItems: currentWishlist });
    },

    clearWishlist: () => {
        localStorage.removeItem('wishlistItems');
        set({ wishlistItems: [] });
    }
}));

export default useWishlistStore;
