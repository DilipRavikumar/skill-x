import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Import Firebase config and Firestore instance
import "./FreelancerProfile.css"; // Import the external CSS file

// Import default profile picture (if applicable)
import defaultProfilePic from "../assets/user-icon.JPG"; // Update path as needed

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
        const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(userData);
          setImgSrc(userData.profileImage || defaultProfilePic); // Set profile image or default
        } else {
          console.error("No such document!");
        }
      } else {
        console.error("User not authenticated");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    navigate("/freelancer-form");
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
        <div className="profile-name">{profile.displayName || "N/A"}</div>
        <div className="profile-bio">{profile.bio || "No bio available"}</div>
      </div>
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-detail">
            <h2 className="label">Email:</h2>
            <p>{profile.email || "Not provided"}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Username:</h2>
            <p>{profile.username || "Not provided"}</p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Role:</h2>
            <p>{profile.role || "Not specified"}</p>
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
            <p>
              {profile.skills && profile.skills.length > 0
                ? profile.skills.join(", ")
                : "No skills listed"}
            </p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Transaction History:</h2>
            <p>
              {profile.transactionHistory &&
              profile.transactionHistory.length > 0
                ? profile.transactionHistory.map((txn, idx) => (
                    <span key={idx}>{txn}</span>
                  ))
                : "No transactions available"}
            </p>
          </div>
          <div className="profile-detail">
            <h2 className="label">Created At:</h2>
            <p>
              {profile.createdAt
                ? new Date(profile.createdAt.seconds * 1000).toLocaleString()
                : "Not available"}
            </p>
          </div>
          <button class="edit-button" onClick={handleEditClick}>
            <svg class="edit-svgIcon" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
