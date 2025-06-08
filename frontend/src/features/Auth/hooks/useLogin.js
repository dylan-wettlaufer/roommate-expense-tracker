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
            return {"success": true}
        } catch (error) {
            console.error('Login failed in useLogin:', error);
            if (error.response) {
              if (error.response.status === 401) {
                setLoginError('Invalid email or password.');
              } else if (error.response.status === 404) {
                setLoginError('No account found with this email.');
              } else {
                setLoginError(error.response.data.detail || 'An unexpected error occurred during login.');
              }
            } else {
              setLoginError('Network error or server unreachable. Please try again.');
            }
            return { success: false, error: loginError };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { handleLogin, isSubmitting, loginError };

}

export default useLogin;