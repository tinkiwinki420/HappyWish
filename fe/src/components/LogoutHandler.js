export const handleLogout = (navigate) => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  navigate("/login");
  window.location.reload();
};
