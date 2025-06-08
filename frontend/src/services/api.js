import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);  

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const loginUser = async (username, password) => {
    try {
        const requestBody = new URLSearchParams();
        requestBody.append('username', username);
        requestBody.append('password', password);

        const loginEnd = "api/v1/login";
        const response = await api.post(loginEnd, requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const {access_token, token_type} = response.data;
        localStorage.setItem('access_token', access_token);

        return {"success": true};

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Error from FastAPI (e.g., 401 Invalid username or password)
            throw new Error(error.response.data.detail || 'Login failed.');
        } else {
            // Network error or other unexpected error
            throw new Error('An unexpected error occurred during login.');
        }
    }
}

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
}


export default api;