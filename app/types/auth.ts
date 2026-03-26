export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
  error?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
  error?: string;
}

export interface UserSession {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}
