import { jwtDecode } from 'jwt-decode';  // Named import for jwtDecode

// Check if user is authenticated and also check for the role if provided
export const isAuthenticated = (role) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    if (role) {
      // If role is provided, return true if the role matches
      return decodedToken?.role === role;
    }
    return true; // Return true if the user is authenticated without checking role
  }
  return false; // Return false if no token
};

// Logout function to clear the token and redirect
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login after logout
};

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true; // Agar token hi nahi hai toh expire maana jayega

  try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
          return true; // Token expire ho chuka hai
      }
      return false;
  } catch (error) {
      return true; // Agar token invalid hai toh bhi expire maana jayega
  }
};
