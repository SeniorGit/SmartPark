// /app/auth/login/components/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthFormData, AuthLogin, AuthLoginErrors } from '@/types/auth';
import { AuthService } from '@/lib/services/authService';
import { validateLoginForm, sanitizeInput } from '@/lib/validation/validation';

import layoutStyles from '@/app/(auth)/component/style/auth.module.css';
import formStyles from '@/app/(auth)/component/style/form.module.css';
import inputStyles from '@/app/(auth)/component/style/input.module.css';
import buttonStyles from '@/app/(auth)/component/style/button.module.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthLogin>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<AuthLoginErrors>({
    email: '',
    password: '',
    general: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from registration
  useEffect(() => {
    if (searchParams.get('message') === 'registration_success') {
      setSuccessMessage('Registration successful! Please login.');
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', password: '', general: '' });

    const validationErrors = validateLoginForm(formData);
    const hasErrors = Object.values(validationErrors).some(error => error !== '');

    if (hasErrors) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await AuthService.login(formData);

      if (result.success && result.data) {
        // Save token and user data
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Redirect based on role
        if (result.data.user.role === 'ADMIN') {
          router.push('/dashboardAdmin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrors({
          ...errors,
          general: result.message || 'Invalid email or password',
        });
      }
    } catch (error) {
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
          <h1 className={layoutStyles.title}>SmartParking</h1>
          <p className={layoutStyles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className={formStyles.form}>
          {successMessage && (
            <div className={formStyles.successAlert}>{successMessage}</div>
          )}
          
          {errors.general && (
            <div className={formStyles.errorAlert}>{errors.general}</div>
          )}

          <div className={formStyles.formGroup}>
            <label htmlFor="email" className={formStyles.label}>
              Email Address
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
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <span className={inputStyles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="password" className={formStyles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`${inputStyles.input} ${
                errors.password ? inputStyles.inputError : ''
              }`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={inputStyles.errorText}>{errors.password}</span>
            )}
          </div>



          <button
            type="submit"
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={buttonStyles.spinner}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={layoutStyles.footer}>
          <p className={layoutStyles.footerText}>
            Dont have an account?{' '}
            <a href="/register" className={layoutStyles.footerLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}