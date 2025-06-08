import { register } from "../services/auth";
import { useState } from "react";

const useRegister = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    const handleRegister = async (email, password) => {
        setIsSubmitting(true);
        setRegisterError(null);

        try {
            const response = await register(email, password);
            console.log('Registration successful in useRegister:', response);
            return {"success": true}
        } catch (error) {
            console.error('Registration failed in useRegister:', error);
            if (error.response) {
              if (error.response.status === 400) {
                setRegisterError('Email already exists.');
              } else {
                setRegisterError(error.response.data.detail || 'An unexpected error occurred during registration.');
              }
            } else {
              setRegisterError('Network error or server unreachable. Please try again.');
            }
            return { success: false, error: registerError };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { handleRegister, isSubmitting, registerError };
}

export default useRegister;
