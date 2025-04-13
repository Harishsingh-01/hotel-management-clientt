import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = (role) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    if (role) {
      return decodedToken?.role === role;
    }
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
          return true;
      }
      return false;
  } catch (error) {
      return true;
  }
};
