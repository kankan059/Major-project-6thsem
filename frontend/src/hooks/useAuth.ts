import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const { user, token, loading } = useSelector((state: RootState) => state.auth);
  const userId = user?.id || '';
  return {
    user,
    token,
    logout,
    id: userId,
    isLoading: loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
    isFreelancer: user?.role === 'freelancer',
  };
};