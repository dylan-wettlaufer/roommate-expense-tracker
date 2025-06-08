import api from "../../../services/api";

export const login = async (email, password) => {
    const requestBody = new URLSearchParams();
    requestBody.append('username', email);
    requestBody.append('password', password);

    const response = await api.post('/login', requestBody, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
}