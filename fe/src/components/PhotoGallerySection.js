import React from "react";

const PhotoGallerySection = ({
  photos,
  handlePhotoChange,
  handlePhotoUpload,
}) => (
  <div>
    <h2>Photos</h2>
    <input
      type='file'
      id='photoGalleryInput'
      multiple
      style={{ display: 'none' }}
      onChange={(e) => {
        handlePhotoChange(e);
        handlePhotoUpload(e);
      }}
    />
    <label htmlFor='photoGalleryInput' className='custom-upload-button'>
      Upload Photos
    </label>
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
