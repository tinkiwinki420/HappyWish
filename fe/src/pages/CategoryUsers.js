import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CategoryUsers.css';

const CategoryUsers = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`/api/categories/${categoryId}/users`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, [categoryId]);

  if (!users.length) {
    return <p>No users available for this category</p>;
  }

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="category-users">
      {users.map(user => (
        <div key={user.id} className="user-profile" onClick={() => handleUserClick(user.id)}>
          {user.profile_photo ? (
            <img src={user.profile_photo} alt={`${user.businessname} profile`} />
          ) : (
            <div className="profile-photo-placeholder">No Profile Photo</div>
          )}
          <p>{user.businessname}</p>
          <p>{user.address}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryUsers;
