/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";

const PhotoGallerySection = ({
  photos,
  handlePhotoChange,
  handlePhotoUpload,
}) => {
  console.log("Received photos:", photos); // Log the received photo URLs

  return (
    <div>
      <h2>Photos</h2>
      <form onSubmit={handlePhotoUpload}>
        <input type="file" multiple onChange={handlePhotoChange} />
        <button type="submit">Upload Photos</button>
      </form>
      <div className="photo-gallery">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={index}>
              <img
                src={photo}  // Make sure this URL is correct
                alt={`Photo ${index + 1}`}
                className="business-photo"
              />
              <p>Photo {index + 1}</p>
            </div>
          ))
        ) : (
          <p>No photos available. Upload some photos to display them here.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoGallerySection;
