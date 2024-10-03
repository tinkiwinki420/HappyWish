export const handleLogout = (navigate) => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  localStorage.removeItem("category");
  navigate("/login");
  window.location.reload();
};
