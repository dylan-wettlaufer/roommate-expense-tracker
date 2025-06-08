import { useState, useEffect, useCallback } from 'react';
import { login as loginApiCall, logout as logoutApiCall } from '../services/auth';
import { useNavigate } from 'react-router-dom'; 

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access_token');
      });
    const [authError, setAuthError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const login = useCallback(async (email, password) => {
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const { success, error } = await loginApiCall(email, password);
            if (success) {
                setIsAuthenticated(true);
                navigate('/groups'); // Redirect to dashboard or home page
                return { success: true };
            } else {
            setAuthError(error || "Login failed. Please check credentials.");
            setIsAuthenticated(false);
            return { success: false, error: error };
        }
        } catch (err) {
            console.error("Login hook error:", err);
            setAuthError("An unexpected error occurred during login.");
            setIsAuthenticated(false);
            return { success: false, error: "An unexpected error occurred." };
        } finally {
            setIsSubmitting(false);
        }
    }, [navigate]);

    const logout = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const { success } = await logoutApiCall();
            if (success) {
                setIsAuthenticated(false);
                navigate('/logout'); // Redirect to login page
                return { success: true };
            } else {
                setAuthError("Logout failed. Please try again.");
                return { success: false, error: "Logout failed." };
            }
        } catch (err) {
            console.error("Logout hook error:", err);
            setAuthError("An unexpected error occurred during logout.");
            return { success: false, error: "An unexpected error occurred." };
        } finally {
            setIsSubmitting(false);
        }
    }, [navigate]);

    return {
        isAuthenticated,
        isSubmitting,
        authError,
        login,
        logout,
    };
}

export default useAuth;
