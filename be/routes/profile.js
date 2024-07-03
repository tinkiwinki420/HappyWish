const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
  }
};

const upload = multer({ 
  storage,
  fileFilter
});

// Get Business User Profile
router.get('/business/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Fetching profile for business user with ID: ${id}`);

  const query = `
    SELECT bu.*, bc.category_name 
    FROM business_users bu 
    LEFT JOIN business_categories bc ON bu.category_id = bc.id 
    WHERE bu.id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      console.log(`User not found for ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    console.log('User found:', user);

    const photoQuery = 'SELECT photo_url FROM business_photos WHERE business_id = ?';

    db.query(photoQuery, [id], (err, photoResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      console.log('Photos found:', photoResults);

      res.status(200).json({
        businessName: user.businessname,
        numOfBusiness: user.numOfBusiness,
        address: user.address,
        email: user.email,
        profilePhoto: user.profile_photo ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(user.profile_photo)}` : null,
        category: user.category_name,
        photos: photoResults.map(photo => `${req.protocol}://${req.get('host')}/uploads/${path.basename(photo.photo_url)}`)
      });
    });
  });
});

// Upload Profile Photo for Business User
router.post('/business/:id/profile-photo', upload.single('profilePhoto'), (req, res) => {
  const id = req.params.id;
  const profilePhotoUrl = path.join('/uploads', req.file.filename);

  const query = 'UPDATE business_users SET profile_photo = ? WHERE id = ?';

  db.query(query, [profilePhotoUrl, id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({ message: 'Profile photo uploaded successfully', profilePhoto: profilePhotoUrl });
  });
});

// Updated upload photo route to use id
router.post('/business/:id/photos', upload.array('photos', 10), (req, res) => {
  const id = req.params.id;
  const photoUrls = req.files.map(file => path.join('/uploads', file.filename));

  const query = 'INSERT INTO business_photos (business_id, photo_url) VALUES ?';
  const values = photoUrls.map(url => [id, url]);

  console.log('Inserting photo URLs:', values);

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({ message: 'Photos uploaded successfully' });
  });
});

// Update Business User Profile
router.put('/business/:id', (req, res) => {
  const id = req.params.id;
  const { businessName, address, email } = req.body;
  console.log(`Updating profile for business user with ID: ${id}`);

  const query = `
    UPDATE business_users 
    SET businessname = ?, address = ?, email = ?
    WHERE id = ?`;

  db.query(query, [businessName, address, email, id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  });
});

// Upload Profile Photo for Regular User
router.post('/regular/:userId/profile-photo', upload.single('profilePhoto'), (req, res) => {
  const userId = req.params.userId;
  const profilePhotoUrl = req.file.filename; // Save only the filename

  const query = 'UPDATE regular_users SET profile_photo = ? WHERE id = ?';

  db.query(query, [profilePhotoUrl, userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: `${req.protocol}://${req.get('host')}/uploads/${profilePhotoUrl}`
    });
  });
});

// Get Regular User Profile
router.get('/regular/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching profile for regular user with ID: ${userId}`);

  const query = 'SELECT * FROM regular_users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      firstName: user.firstname,
      lastName: user.lastname,
      id: user.id,
      number: user.number,
      address: user.address,
      dob: user.dob,
      email: user.email,
      profilePhoto: user.profile_photo ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_photo}` : null // Include profile photo URL
    });
  });
});

// Update Regular User Profile
router.put('/regular/:userId', (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, id, number, address, dob, email } = req.body;
  console.log(`Updating profile for regular user with ID: ${userId}`);

  const query = `
    UPDATE regular_users 
    SET firstname = ?, lastname = ?, id = ?, number = ?, address = ?, dob = ?, email = ?
    WHERE id = ?`;

  db.query(query, [firstName, lastName, id, number, address, dob, email, userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  });
});

module.exports = router;
