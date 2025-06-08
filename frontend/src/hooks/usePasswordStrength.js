// src/hooks/usePasswordStrength.js
import { useMemo } from 'react';

const usePasswordStrength = (password) => {
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: '', feedback: '' };

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('8+ characters');

    // Lowercase
    if (/[a-z]/.test(password)) score++;
    else feedback.push('lowercase letter');

    // Uppercase
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('uppercase letter');

    // Number
    if (/\d/.test(password)) score++;
    else feedback.push('number');

    // Special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('special character');

    const strengthLevels = [
      { text: 'Very Weak', color: 'text-red-600' },
      { text: 'Weak', color: 'text-red-500' },
      { text: 'Fair', color: 'text-yellow-500' },
      { text: 'Good', color: 'text-blue-500' },
      { text: 'Strong', color: 'text-green-500' },
      { text: 'Very Strong', color: 'text-green-600' }
    ];

    return {
      score,
      text: strengthLevels[score].text,
      color: strengthLevels[score].color,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'All requirements met'
    };
  }, [password]);

  return passwordStrength;
};

export default usePasswordStrength;