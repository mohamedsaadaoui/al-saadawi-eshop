import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface UserPreferencesContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
    wishlist: number[];
    toggleWishlist: (productId: number) => void;
    isWishlisted: (productId: number) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        const storedRecent = localStorage.getItem('recentlyViewed');
        if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    }, []);

    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(p => p.id !== product.id);
            const updated = [product, ...filtered].slice(0, 5); // Keep last 5
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleWishlist = (productId: number) => {
        setWishlist(prev => {
            const updated = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            localStorage.setItem('wishlist', JSON.stringify(updated));
            return updated;
        });
    };

    const isWishlisted = (id: number) => wishlist.includes(id);

    return (
        <UserPreferencesContext.Provider value={{ recentlyViewed, addToRecentlyViewed, wishlist, toggleWishlist, isWishlisted }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (!context) throw new Error('useUserPreferences must be used within UserPreferencesProvider');
    return context;
};
