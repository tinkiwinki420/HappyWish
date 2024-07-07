import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constans";
import "../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleFileChange = (e) => {
    setCategoryPhoto(e.target.files[0]);
  };

  const handleUploadPhoto = async (categoryId) => {
    if (!categoryPhoto) {
      alert("Please select a photo to upload");
      return;
    }

    const formData = new FormData();
    formData.append("categoryPhoto", categoryPhoto);

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${categoryId}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh categories to show the updated photo
        fetch(`${API_URL}/api/categories`)
          .then((response) => response.json())
          .then((data) => setCategories(data));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error uploading photo");
      }
    } catch (error) {
      console.error("Error uploading category photo:", error);
    }
  };

  return (
    <div className='categories-container'>
      <h1>Categories</h1>
      <div className='categories-grid'>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className='category-item'>
              <img
                src={
                  category.category_photo
                    ? `${API_URL}${category.category_photo}`
                    : "https://via.placeholder.com/100"
                }
                alt={category.name}
                onClick={() => handleCategoryClick(category.id)}
              />
              <p>{category.name}</p>
              <input type='file' onChange={handleFileChange} />
              <button onClick={() => handleUploadPhoto(category.id)}>
                Upload Photo
              </button>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
