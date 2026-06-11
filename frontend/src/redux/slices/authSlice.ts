import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin';
  _id?: string; // Added: Catch mongoDB raw id fallback if backend leaks it
}

interface AuthState {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
}

const getInitialData = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  }
  return { user: null, token: null };
};

const initialState: AuthState = {
  ...getInitialData(),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserPayload; token: string }>) => {
      // Direct assignment with guaranteed structural parsing
      const rawUser = action.payload.user;
      
      // Normalize: ensures 'id' is always populated even if backend sends '_id'
      const normalizedUser: UserPayload = {
        id: rawUser.id || rawUser._id || '',
        name: rawUser.name,
        email: rawUser.email,
        role: rawUser.role
      };

      state.user = normalizedUser;
      state.token = action.payload.token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;