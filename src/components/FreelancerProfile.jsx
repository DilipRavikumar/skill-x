import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Import Firebase config and Firestore instance
import './FreelancerProfile.css'; // Import the external CSS file

// Import default profile picture (if applicable)
import defaultProfilePic from '../assets/user-icon.JPG'; // Update path as needed

const FreelancerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [imgSrc, setImgSrc] = useState(defaultProfilePic);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser; // Get the current logged-in user

      if (user) {
        const userRef = doc(db, 'users', user.uid); // Reference to the user's document in Firestore
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(userData);
          setImgSrc(userData.profileImage || defaultProfilePic); // Set profile image or default
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('User not authenticated');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    navigate('/freelancer-form');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img className="profile-image" src={imgSrc} alt="Profile" />
        <div className="profile-name">{profile.displayName || 'N/A'}</div>
        <div className="profile-bio">{profile.bio || 'No bio available'}</div>
      </div>
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-detail">
            <h2 className="label">Email:</h2>
            <p>{profile.email || 'Not provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Username:</h2>
            <p>{profile.username || 'Not provided'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Role:</h2>
            <p>{profile.role || 'Not specified'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Balance:</h2>
            <p>${profile.balance || 0}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Rating:</h2>
            <p>{profile.rating || 0}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Completed Orders:</h2>
            <p>{profile.completedOrders || 0}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Skills:</h2>
            <p>{profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'No skills listed'}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Transaction History:</h2>
            <p>{profile.transactionHistory && profile.transactionHistory.length > 0 
              ? profile.transactionHistory.map((txn, idx) => (
                <span key={idx}>{txn}</span>
              )) 
              : 'No transactions available'}
            </p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Created At:</h2>
            <p>{profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleString() : 'Not available'}</p>
          </div>
          <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
