import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryUsers.css';

const CategoryUsers = () => {
  const { categoryId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/categories/${categoryId}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [categoryId]);

  if (!users.length) {
    return <p>No users available for this category</p>;
  }

  return (
    <div className="category-users">
      {users.map(user => (
        <div key={user.id} className="user-profile">
          {user.profilePhoto ? (
            <img src={user.profile_photo} alt={`${user.businessame} profile`} />
          ) : (
            <div className="profile-photo-placeholder">No Profile Photo</div>
          )}
          <p>{user.businessname}</p>
          <p>{user.address}</p>
          <p>{user.email}</p>
          {/* Add more user details as needed */}
        </div>
      ))}
    </div>
  );
};

export default CategoryUsers;
