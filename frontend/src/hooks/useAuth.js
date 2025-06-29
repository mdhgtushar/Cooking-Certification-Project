import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { 
  loginUser, 
  registerUser, 
  updateUserProfile, 
  logout as logoutAction,
  clearError 
} from '../store/userSlice';
import { userService } from '../services/userService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.user);

  const login = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const getProfile = async () => {
    // Return current user data from store without making API call
    if (user && isAuthenticated) {
      return { success: true };
    }
    
    // If no user data, try to get from localStorage
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      return { success: true };
    }
    
    return { success: false, error: 'No user data available' };
  };

  const updateProfile = async (userData) => {
    try {
      await dispatch(updateUserProfile(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    userService.logout();
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const checkAuth = () => {
    return userService.isAuthenticated();
  };

  const getCurrentUser = () => {
    return userService.getCurrentUser();
  };

  const getToken = () => {
    return userService.getToken();
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isInstructor = () => {
    return user?.role === 'instructor';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    register,
    getProfile,
    updateProfile,
    logout,
    clearAuthError,
    
    // Utilities
    checkAuth,
    getCurrentUser,
    getToken,
    isAdmin,
    isInstructor,
    isStudent,
    hasRole,
    hasAnyRole
  }), [user, token, isAuthenticated, loading, error]);
}; 