import { AuthFormData, AuthErrors, AuthLogin, AuthLoginErrors} from '@/types/auth';

export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain uppercase, lowercase, and number';
  }
  return '';
};

export const validateName = (name: string, field: string): string => {
  if (!name) return `${field} is required`;
  if (name.length < 2) return `${field} must be at least 2 characters`;
  if (!/^[a-zA-Z\s]+$/.test(name)) return `${field} can only contain letters and spaces`;
  return '';
};

export const validatePhoneNumber = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.length < 8) return 'Phone number must be at least 8 digits';
  if (!/^\+?[0-9]+$/.test(cleanPhone)) {
    return 'Phone number can only contain numbers and optional + prefix';
  }
  return '';
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateLoginForm = (formData: AuthLogin): AuthLoginErrors => {
  return {
    email: validateEmail(sanitizeInput(formData.email)),
    password: validatePassword(formData.password),
    general: '',
  };
};

export const validateRegisterForm = (formData: AuthFormData): AuthErrors => {
  return {
    email: validateEmail(sanitizeInput(formData.email)),
    password: validatePassword(formData.password),
    first_name: validateName(sanitizeInput(formData.first_name || ''), 'First name'),
    last_name: validateName(sanitizeInput(formData.last_name || ''), 'Last name'),
    phone_number: validatePhoneNumber(sanitizeInput(formData.phone_number || '')),
    general: '',
  };
};