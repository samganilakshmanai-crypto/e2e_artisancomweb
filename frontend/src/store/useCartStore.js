import { create } from 'zustand';

const useCartStore = create((set) => ({
    cartItems: [],
    addToCart: (item) => set((state) => {
        if (state.cartItems.length > 0) {
            const currentArtisanId = state.cartItems[0].artisanId?._id || state.cartItems[0].artisanId;
            const newArtisanId = item.artisanId?._id || item.artisanId;
            
            if (currentArtisanId !== newArtisanId) {
                alert("You can only check out items from a single Artisan per order. Please clear your cart first to switch makers.");
                return state;
            }
        }

        const existingItem = state.cartItems.find(i => i._id === item._id);
        if (existingItem) {
            return {
                cartItems: state.cartItems.map(i => 
                    i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
                )
            };
        }
        return { cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }] };
    }),
    removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(i => i._id !== id)
    })),
    updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map(i => 
            i._id === id ? { ...i, quantity } : i
        )
    })),
    clearCart: () => set({ cartItems: [] })
}));

export default useCartStore;
