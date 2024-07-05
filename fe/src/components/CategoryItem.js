import React from 'react';

const CategoryItem = ({ category }) => {
  return (
    <div className="category-item">
      <p>{category.name}</p>
    </div>
  );
};

export default CategoryItem;
