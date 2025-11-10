export interface AuthFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthErrors {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  general: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      phone_number: string;
      last_name: string;
      role: 'USER' | 'ADMIN';
    };
  };
  message?: string;
}

export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthLoginErrors {
  email: string;
  password: string;
  general: string;
}