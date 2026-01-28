import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface Setting {
    settingKey: string;
    settingValue: string;
}

interface StoreContextType {
    settings: Record<string, string>;
    getSetting: (key: string) => string;
    loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            const settingsMap: Record<string, string> = {};
            response.data.forEach((s: Setting) => {
                settingsMap[s.settingKey] = s.settingValue;
            });
            setSettings(settingsMap);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const getSetting = (key: string) => settings[key] || '';

    return (
        <StoreContext.Provider value={{ settings, getSetting, loading }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
