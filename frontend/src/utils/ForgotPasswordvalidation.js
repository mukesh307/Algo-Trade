// utils/validation.js

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };
  
  export const validatePassword = (password) => {
    // Password must have at least one letter, one digit, and be at least 6 characters long.
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{6,}$/;
    return passwordRegex.test(password);
  };
  
  
  export const validateOtp = (otp) => {
    return /^\d{6}$/.test(otp);
  };
  