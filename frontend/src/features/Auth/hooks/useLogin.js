import { useState } from "react";
import { login } from "../services/auth";

const useLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const handleLogin = async (email, password) => {
        setIsSubmitting(true);
        setLoginError(null);

        try {
            const response = await login(email, password);
            console.log('Login successful in useLogin:', response);
            return { success: true };
        } catch (error) {
            console.error('Login failed in useLogin:', error);
            
            let errorMessage = 'An unexpected error occurred during login.';
            
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Invalid email or password.';
                } else if (error.response.status === 404) {
                    errorMessage = 'No account found with this email.';
                } else {
                    errorMessage = error.response.data.detail || 'An unexpected error occurred during login.';
                }
            } else {
                errorMessage = 'Network error or server unreachable. Please try again.';
            }
            
            setLoginError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { handleLogin, isSubmitting };
}

export default useLogin;