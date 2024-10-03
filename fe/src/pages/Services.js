import React, { useEffect, useState } from "react";
import "../styles/Services.css";

const Services = () => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [exclusiveMeal, setExclusiveMeal] = useState(null); // Single exclusive meal
  const [regularMeals, setRegularMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: "",
    description: "",
    image: null,
    price: "",
    preview: null, // For previewing the image before upload
  });
  const [showExclusiveForm, setShowExclusiveForm] = useState(false);
  const [showRegularForm, setShowRegularForm] = useState(false);
  const [showPhotoUpdateForm, setShowPhotoUpdateForm] = useState(false);
  const [editMode, setEditMode] = useState({
    isEditing: false,
    mealType: "",
    mealId: null,
  });

  useEffect(() => {
    if (userId) {
      // Fetch regular meals by user ID
      fetch(`/api/meals/regular/user/${userId}`)
        .then((response) => response.json())
        .then((data) => setRegularMeals(data))
        .catch((error) =>
          console.error("Error fetching regular meals:", error)
        );

      // Fetch exclusive meal by user ID
      fetch(`/api/meals/exclusive/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setExclusiveMeal(data[0]); // Assuming you want the first exclusive meal
          }
        })
        .catch((error) =>
          console.error("Error fetching exclusive meal:", error)
        );
    }
  }, [userId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewMeal((prevMeal) => ({
      ...prevMeal,
      image: file,
      preview: URL.createObjectURL(file), // Set preview URL
    }));
  };

  const addExclusiveMeal = () => {
    if (newMeal.name && newMeal.description && newMeal.image && newMeal.price) {
      const formData = new FormData();
      formData.append("name", newMeal.name);
      formData.append("description", newMeal.description);
      formData.append("price", newMeal.price);
      formData.append("image", newMeal.image);
      formData.append("user_id", userId);

      fetch("/api/meals/exclusive", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Exclusive meal added:", data);
          setExclusiveMeal({
            ...newMeal,
            image: `/uploads/${data.image}`, // Use the correct path for the image
          });
          setNewMeal({
            name: "",
            description: "",
            image: null,
            price: "",
            preview: null,
          });
          setShowExclusiveForm(false);
        })
        .catch((error) => console.error("Error adding exclusive meal:", error));
    } else {
      alert("Please fill in all fields for the exclusive meal.");
    }
  };

  const addRegularMeal = () => {
    if (newMeal.name && newMeal.description && newMeal.image && newMeal.price) {
      const formData = new FormData();
      formData.append("name", newMeal.name);
      formData.append("description", newMeal.description);
      formData.append("price", newMeal.price);
      formData.append("image", newMeal.image);
      formData.append("user_id", userId);

      fetch("/api/meals/regular", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Regular meal added:", data);
          setRegularMeals([
            ...regularMeals,
            {
              ...newMeal,
              image: `/uploads/${data.image}`, // Use the correct path for the image
            },
          ]);
          setNewMeal({
            name: "",
            description: "",
            image: null,
            price: "",
            preview: null,
          });
          setShowRegularForm(false);
        })
        .catch((error) => console.error("Error adding regular meal:", error));
    } else {
      alert("Please fill in all fields for the regular meal.");
    }
  };

  const updateMealPhoto = () => {
    const formData = new FormData();
    formData.append("image", newMeal.image);

    fetch(`/api/meals/${editMode.mealType}/${editMode.mealId}/photo`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Meal photo updated:", data);
        const updatedImagePath = `/uploads/${data.image}`; // Use the correct path for the image
        if (editMode.mealType === "exclusive") {
          setExclusiveMeal((prevMeal) => ({
            ...prevMeal,
            image: updatedImagePath,
          }));
        } else {
          setRegularMeals((prevMeals) =>
            prevMeals.map((meal) =>
              meal.id === editMode.mealId
                ? { ...meal, image: updatedImagePath }
                : meal
            )
          );
        }
        cancelEdit();
      })
      .catch((error) => console.error("Error updating meal photo:", error));
  };

  const updateMealDetails = () => {
    if (newMeal.name && newMeal.description && newMeal.price) {
      const body = {
        name: newMeal.name,
        description: newMeal.description,
        price: newMeal.price,
      };

      fetch(`/api/meals/${editMode.mealType}/${editMode.mealId}/details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Meal details updated:", data);
          if (editMode.mealType === "exclusive") {
            setExclusiveMeal((prevMeal) => ({ ...prevMeal, ...body }));
          } else {
            setRegularMeals((prevMeals) =>
              prevMeals.map((meal) =>
                meal.id === editMode.mealId ? { ...meal, ...body } : meal
              )
            );
          }
          cancelEdit();
        })
        .catch((error) => console.error("Error updating meal details:", error));
    } else {
      alert("Please fill in all fields for the meal details.");
    }
  };

  const startEditMeal = (mealType, meal) => {
    setEditMode({ isEditing: true, mealType, mealId: meal.id });
    setNewMeal({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      image: null,
      preview: meal.image, // Use the existing image as the preview
    });
  };

  const startPhotoUpdate = (mealType, mealId) => {
    setEditMode({ isEditing: true, mealType, mealId });
    setShowPhotoUpdateForm(true);
  };

  const cancelEdit = () => {
    setEditMode({ isEditing: false, mealType: "", mealId: null });
    setShowPhotoUpdateForm(false);
    setNewMeal({
      name: "",
      description: "",
      image: null,
      price: "",
      preview: null,
    });
  };

  const deleteExclusiveMeal = (mealId) => {
    fetch(`/api/meals/exclusive/${mealId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Exclusive meal deleted:", data);
        setExclusiveMeal(null); // Clear the exclusive meal from the state
      })
      .catch((error) => console.error("Error deleting exclusive meal:", error));
  };

  const deleteRegularMeal = (mealId) => {
    fetch(`/api/meals/regular/${mealId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Regular meal deleted:", data);
        setRegularMeals(regularMeals.filter((m) => m.id !== mealId));
      })
      .catch((error) => console.error("Error deleting regular meal:", error));
  };

  return (
    <div className='profile-container'>
      <h1>Hall Services</h1>

      <h2>Exclusive Meal</h2>
      {!exclusiveMeal && !showExclusiveForm && (
        <button onClick={() => setShowExclusiveForm(true)}>
          Add Exclusive Meal
        </button>
      )}
      {showExclusiveForm && !editMode.isEditing && (
        <div>
          <input
            type='text'
            placeholder='Meal Name'
            value={newMeal.name || ""}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <input
            type='text'
            placeholder='Description'
            value={newMeal.description || ""}
            onChange={(e) =>
              setNewMeal({ ...newMeal, description: e.target.value })
            }
          />
          <input
            type='number'
            placeholder='Price'
            value={newMeal.price || ""}
            onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
          />
          <input type='file' onChange={handleImageUpload} />
          {newMeal.preview && (
            <img
              src={newMeal.preview}
              alt='Preview'
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <div>
            <button onClick={addExclusiveMeal}>Save Exclusive Meal</button>
            <button onClick={() => setShowExclusiveForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {exclusiveMeal && (
        <div className='meal-container'>
          <img
            src={exclusiveMeal.image} // Display the correct server path image
            alt={exclusiveMeal.name}
            style={{ width: "100px", height: "100px" }}
          />
          <h3>{exclusiveMeal.name}</h3>
          <p>{exclusiveMeal.description}</p>
          <p>{exclusiveMeal.price}</p>
          <div className='dropdown'>
            <button className='dropbtn'>⋮</button>
            <div className='dropdown-content'>
              <button onClick={() => startEditMeal("exclusive", exclusiveMeal)}>
                Update Details
              </button>
              <button
                onClick={() => startPhotoUpdate("exclusive", exclusiveMeal.id)}
              >
                Update Photo
              </button>
              <button onClick={() => deleteExclusiveMeal(exclusiveMeal.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {editMode.isEditing && !showPhotoUpdateForm && (
        <div>
          <h3>Update Meal Details</h3>
          <input
            type='text'
            placeholder='Meal Name'
            value={newMeal.name || ""}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <input
            type='text'
            placeholder='Description'
            value={newMeal.description || ""}
            onChange={(e) =>
              setNewMeal({ ...newMeal, description: e.target.value })
            }
          />
          <input
            type='number'
            placeholder='Price'
            value={newMeal.price || ""}
            onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
          />
          <button onClick={updateMealDetails}>Save Details</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      )}

      {showPhotoUpdateForm && (
        <div>
          <h3>Update Meal Photo</h3>
          <input type='file' onChange={handleImageUpload} />
          {newMeal.preview && (
            <img
              src={newMeal.preview}
              alt='Preview'
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <button onClick={updateMealPhoto}>Save Photo</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      )}

      <h2>Regular Meals</h2>
      {!showRegularForm && !editMode.isEditing && (
        <button onClick={() => setShowRegularForm(true)}>
          Add Regular Meal
        </button>
      )}
      {showRegularForm && !editMode.isEditing && (
        <div>
          <input
            type='text'
            placeholder='Meal Name'
            value={newMeal.name || ""}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <input
            type='text'
            placeholder='Description'
            value={newMeal.description || ""}
            onChange={(e) =>
              setNewMeal({ ...newMeal, description: e.target.value })
            }
          />
          <input
            type='number'
            placeholder='Price'
            value={newMeal.price || ""}
            onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })}
          />
          <input type='file' onChange={handleImageUpload} />
          {newMeal.preview && (
            <img
              src={newMeal.preview}
              alt='Preview'
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <div>
            <button onClick={addRegularMeal}>Save Regular Meal</button>
            <button onClick={() => setShowRegularForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ul>
        {regularMeals.map((meal, index) => (
          <li key={index} className='meal-container'>
            <img
              src={meal.image} // Display the correct server path image
              alt={meal.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            <p>{meal.price}</p>
            <div className='dropdown'>
              <button className='dropbtn'>⋮</button>
              <div className='dropdown-content'>
                <button onClick={() => startEditMeal("regular", meal)}>
                  Update Details
                </button>
                <button onClick={() => startPhotoUpdate("regular", meal.id)}>
                  Update Photo
                </button>
                <button onClick={() => deleteRegularMeal(meal.id)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
