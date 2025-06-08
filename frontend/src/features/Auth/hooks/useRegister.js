import { register } from "../services/auth";
import { useState } from "react";

const useRegister = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    const handleRegister = async (first_name, last_name, email, password, confirmPassword) => {
        setIsSubmitting(true);
        setRegisterError(null);

        try {
            const result = await register(first_name, last_name, email, password, confirmPassword);
            
            // Check if the result indicates failure
            if (result && result.success === false) {
                setRegisterError(result.error);
                return { success: false, error: result.error };
            }
            
            // If we get here, registration was successful
            return { success: true };
        } catch (error) {
            // This handles any unexpected errors that might be thrown
            const errorMessage = error.message || 'Registration failed. Please try again.';
            setRegisterError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { handleRegister, isSubmitting, registerError };
}

export default useRegister;