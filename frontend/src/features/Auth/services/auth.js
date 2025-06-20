import api from "../../../services/api";

export const login = async (email, password) => {
    const requestBody = new URLSearchParams();
    requestBody.append('username', email);
    requestBody.append('password', password);

    try {
        const response = await api.post('/login', requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            const { access_token, token_type } = response.data;

            if (access_token && token_type) {
                localStorage.setItem('access_token', access_token);
                console.log("LOGIN API: successfully received and stored token.");
                return { success: true, data: response.data };
            }
            return { success: false, error: "Login failed. Please try again." };
        } else if (response.status === 401) {
            return { success: false, error: "Invalid credentials." };
        } else {
            return { success: false, error: "Login failed. Please try again." };
        }
    } catch (err) {
        console.error("Login API Error!", err);
        return { success: false, error: err.detail };
    }
};

export const logout = async () => {
    localStorage.removeItem('access_token');
    return {success: true};
};

export const register = async (first_name, last_name, email, password, confirmPassword) => {

    try {
        const response = await api.post('/register', {
            first_name,
            last_name,
            email,
            password,
            confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error("Registration API error:", error.response || error);

        let errorMessage = "Registration failed. Please try again."; // Default fallback message

        if (error.response && error.response.data) {
            const errorData = error.response.data;

            // Case 1: FastAPI validation errors (often 'detail' which is an array of objects)
            if (errorData.detail && Array.isArray(errorData.detail)) {
                // Join all 'msg' properties from the array of validation errors
                errorMessage = errorData.detail.map(err => err.msg).join('; ');
            }
            // Case 2: FastAPI might return a single error object with 'msg' directly
            else if (errorData.msg) {
                errorMessage = errorData.msg;
            }
            // Case 3: Simple string error message from the server
            else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
            // Case 4: Other common error message keys (e.g., 'message')
            else if (errorData.message) {
                errorMessage = errorData.message;
            }
            // Case 5: Direct error message
            else if (errorData.detail) {
                errorMessage = errorData.detail;
            }
            // Case 6: Direct string error
            else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
            // Fallback for any other unexpected object structures, convert to string
            else if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = JSON.stringify(errorData); // Stringify complex objects
            }
        }
        return { success: false, error: errorMessage }; // Indicate failure and return a string error message
    }
}