import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';
const BACKEND_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to get full image URL
export const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) {
        // SVG placeholder: 400x400 with #0F172A background and #D4AF37 text
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzBGMTcyQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNENEFGMzciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    }

    // If already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's a relative URL starting with /api/files/, prepend backend URL
    if (imageUrl.startsWith('/api/files/')) {
        return BACKEND_URL + imageUrl;
    }

    // Otherwise, assume it's just a filename
    return BACKEND_URL + '/api/files/' + imageUrl;
};

export default api;
