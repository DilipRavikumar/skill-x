import React, { useState, useEffect } from 'react';
import { useProfile } from '../components/ProfileContext'; // Update path if needed
import { useNavigate } from 'react-router-dom';
import './FreelancerProfile.css'; // Import the external CSS file

// Import default profile picture and additional image
import defaultProfilePic from '../assets/user-icon.JPG'; // Update path as needed
import illustrationImage from '../assets/FreelanceImg.png'; // Update path as needed

const FreelancerProfile = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Set up state and effect hooks at the top level
  const [imgSrc, setImgSrc] = useState(profile?.profilePicture || defaultProfilePic);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        img.src = profile?.profilePicture || defaultProfilePic;
        img.onload = () => setImgSrc(img.src);
        img.onerror = () => setImgSrc(defaultProfilePic);
      } catch (error) {
        setImgSrc(defaultProfilePic);
      }
    };

    loadImage();
  }, [profile?.profilePicture]);

  const handleEditClick = () => {
    navigate('/freelancer-form');
  };

  // Debugging: Log profile data
  useEffect(() => {
    console.log('Profile:', profile);
  }, [profile]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img className="profile-image" src={imgSrc} alt="Profile" />
        <div className="profile-name">{profile.name}</div>
        <div className="profile-bio">{profile.bio}</div>
      </div>
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-detail">
            <h2 className="label">About:</h2>
            <p>{profile.about || 'No information available'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Skills:</h2>
            <p>{profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'No skills listed'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Category:</h2>
            <p>{profile.category || 'Not provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Hourly Rate:</h2>
            <p>{profile.hourlyRate ? `$${profile.hourlyRate}` : 'Not provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Portfolio:</h2>
            <p>{profile.portfolio || 'No portfolio URL provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Social Media Links:</h2>
            <p>{profile.socialMediaLinks || 'No social media links provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Availability:</h2>
            <p>{profile.availability || 'Not specified'}</p>
          </div>

          <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
        </div>
        <div className="illustration-container">
          <img className="illustration-image" src={illustrationImage} alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
