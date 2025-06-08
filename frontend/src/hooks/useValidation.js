import { useState } from "react";

const useValidation = () => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (field, value, allFormData, validationRules) => {
        let error = '';
        if (validationRules[field]) {
            error = validationRules[field](value, allFormData);
        }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
        return error
    };

    const handleBlur = (field, value, allFormData, validationRules) => {
        setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
        validateField(field, value, allFormData, validationRules);
    };

    const validateForm = (formData, validationRules) => {
        const newErrors = {};
        let formIsValid = true;
        Object.keys(formData).forEach((field) => {
          const error = validateField(field, formData[field], formData, validationRules); // Pass formData to validateField
          newErrors[field] = error;
          if (error) formIsValid = false;
        });
        setErrors(newErrors);
        // Mark all fields as touched after a full form validation attempt
        setTouched(Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
        return formIsValid;
    };

    return {
        errors,
        touched,
        setErrors,
        handleBlur,
        validateField,
        validateForm,
    };
}

export default useValidation;
