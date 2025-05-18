import axios from 'axios';

const baseUrl = "http://localhost:8000/api/auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}/login/`, {
      username,
      password,
    });

    const data = response.data;
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const register = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${baseUrl}/register/`, {
      username,
      email,
      password,
    });

    // Consider both 200 and 201 as successful responses
    if (response.status >= 200 && response.status < 300) {
      // Only store tokens if they exist in response
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      return { 
        success: true,
        data: response.data,
        message: 'Registration successful' 
      };
    }

    // Handle non-successful but non-error responses
    throw new Error(response.data.message || 'Registration failed');

  } catch (error) {
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.detail ||
                        error.message ||
                        'Registration failed';
    
    console.error('Registration error:', errorMessage);
    return { 
      success: false,
      message: errorMessage 
    };
  }
};
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
