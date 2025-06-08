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