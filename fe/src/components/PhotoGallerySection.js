import React from "react";

const PhotoGallerySection = ({
  photos,
  handlePhotoChange,
  handlePhotoUpload,
}) => (
  <div>
    <h2>Photos</h2>
    <form onSubmit={handlePhotoUpload}>
      <input type='file' multiple onChange={handlePhotoChange} />
      <button type='submit'>Upload Photos</button>
    </form>
    <div className='photo-gallery'>
      {photos.map((photo, index) => (
        <div key={index}>
          {console.log(photo)}
          <img
            src={photo}
            alt={`Photo ${index + 1}`}
            className='business-photo'
          />
          <p>Photo {index + 1}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PhotoGallerySection;
