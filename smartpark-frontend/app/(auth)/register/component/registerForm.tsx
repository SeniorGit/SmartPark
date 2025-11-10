'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthFormData, AuthErrors } from '@/types/auth';
import { AuthService } from '@/lib/services/authService';
import { validateRegisterForm, sanitizeInput } from '@/lib/validation/validation';

import layoutStyles from '@/app/(auth)/component/style/auth.module.css';
import formStyles from '@/app/(auth)/component/style/form.module.css';
import inputStyles from '@/app/(auth)/component/style/input.module.css';
import buttonStyles from '@/app/(auth)/component/style/button.module.css';
import registerStyles from './register.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState<AuthErrors>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    general: '',
  });

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof AuthErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  setIsLoading(true);
  setErrors({ email: '', password: '', first_name: '', last_name: '', phone_number: '', general: '' });

  const validationErrors = validateRegisterForm(formData);
  const hasErrors = Object.values(validationErrors).some(error => error !== '');

  if (hasErrors) {
    setErrors(validationErrors);
    setIsLoading(false);
    return;
  }

  try {
    const result = await AuthService.register(formData);
    if (result.success) {
      router.push('/login?message=registration_success');
    } else {
      setErrors({
        ...errors,
        general: result.message || 'Registration failed. Please try again.',
      });
    }
  } catch (error) {
    console.error('💥 Registration error:', error);
    setErrors({
      ...errors,
      general: 'An unexpected error occurred. Please try again.',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.authCard}>
        <div className={layoutStyles.header}>
          <h1 className={layoutStyles.title}>Join SmartParking</h1>
          <p className={layoutStyles.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className={formStyles.form}>
          {errors.general && (
            <div className={formStyles.errorAlert}>{errors.general}</div>
          )}

          <div className={registerStyles.nameRow}>
            <div className={registerStyles.nameField}>
              <label htmlFor="first_name" className={formStyles.label}>
                First Name *
              </label>
              <input
                id="first_name"
                type="text"
                className={`${inputStyles.input} ${
                  errors.first_name ? inputStyles.inputError : ''
                }`}
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={isLoading}
                maxLength={50}
              />
              {errors.first_name && (
                <span className={inputStyles.errorText}>
                  {errors.first_name}
                </span>
              )}
            </div>

            <div className={registerStyles.nameField}>
              <label htmlFor="last_name" className={formStyles.label}>
                Last Name *
              </label>
              <input
                id="last_name"
                type="text"
                className={`${inputStyles.input} ${
                  errors.last_name ? inputStyles.inputError : ''
                }`}
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={isLoading}
                maxLength={50}
              />
              {errors.last_name && (
                <span className={inputStyles.errorText}>{errors.last_name}</span>
              )}
            </div>
          </div>

          {/* phone Numvber */}
          <div className={formStyles.formGroup}>
            <label htmlFor="phone_number" className={formStyles.label}>
              Phone Number *
            </label>
            <input
              id="phone_number"
              type="phone_number"
              className={`${inputStyles.input} ${
                errors.phone_number ? inputStyles.inputError : ''
              }`}
              placeholder="085156900000"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.phone_number && (
              <span className={inputStyles.errorText}>{errors.phone_number}</span>
            )}
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`${inputStyles.input} ${
                errors.email ? inputStyles.inputError : ''
              }`}
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.email && (
              <span className={inputStyles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="password" className={formStyles.label}>
              Password *
            </label>
            <input
              id="password"
              type="password"
              className={`${inputStyles.input} ${
                errors.password ? inputStyles.inputError : ''
              }`}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              maxLength={50}
            />
            {errors.password && (
              <span className={inputStyles.errorText}>{errors.password}</span>
            )}
            <div className={registerStyles.passwordHint}>
              Must be at least 6 characters with uppercase, lowercase, and number
            </div>
          </div>

          <button
            type="submit"
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={buttonStyles.spinner}></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className={layoutStyles.footer}>
          <p className={layoutStyles.footerText}>
            Already have an account?{' '}
            <a href="/login" className={layoutStyles.footerLink}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}