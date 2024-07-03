import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const Profile = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Profile Page</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
