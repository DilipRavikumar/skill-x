import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerDashboard.css"; // Import the external CSS file
import { useProfile } from "./components/ProfileContext"; // Update path as needed
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  FaUser,
  FaBriefcase,
  FaBox,
  FaEnvelope,
  FaStar,
  FaCog,
} from "react-icons/fa"; // Import icons
import OrdersList from './components/OrdersList'

const FreelancerDashboard = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("my-gigs");
  const [gigs, setGigs] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch gigs created by the logged-in freelancer
        try {
          const gigsQuery = query(
            collection(firestore, "gigs"),
            where("freelancerId", "==", user.uid)
          );
          const querySnapshot = await getDocs(gigsQuery);
          const fetchedGigs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGigs(fetchedGigs);
        } catch (error) {
          console.error("Error fetching gigs: ", error);
        }
      } else {
        setGigs([]);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Skill-X Freelancer Dashboard</h1>
      </header>
      <aside className="sidebar">
        <div className="sidebar-button-container">
          <button
            className={`sidebar-button ${currentSection === "profile" ? "active" : ""}`}
            onClick={() => handleSectionChange("profile")}
          >
            <FaUser className="icon" /> <span>Profile Overview</span>
          </button>
          <button
            className={`sidebar-button ${currentSection === "my-gigs" ? "active" : ""}`}
            onClick={() => handleSectionChange("my-gigs")}
          >
            <FaBriefcase className="icon" /> <span>My Gigs</span>
          </button>
          <button
            className={`sidebar-button ${currentSection === "orders" ? "active" : ""}`}
            onClick={() => handleSectionChange("orders")}
          >
            <FaBox className="icon" /> <span>Orders</span>
          </button>
          <button
            className={`sidebar-button ${currentSection === "messages" ? "active" : ""}`}
            onClick={() => handleSectionChange("messages")}
          >
            <FaEnvelope className="icon" /> <span>Messages</span>
          </button>
          <button
            className={`sidebar-button ${currentSection === "reviews" ? "active" : ""}`}
            onClick={() => handleSectionChange("reviews")}
          >
            <FaStar className="icon" /> <span>Reviews</span>
          </button>
          <button
            className={`sidebar-button ${currentSection === "settings" ? "active" : ""}`}
            onClick={() => handleSectionChange("settings")}
          >
            <FaCog className="icon" /> <span>Account Settings</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {currentSection === "profile" && (
          <div>
            <h2 className="section-title">Profile Overview</h2>
            <div className="profile-card">
              <img
                className="profile-image"
                src={profile?.profileImage || "/default-profile.png"}
                alt="Profile"
              />
              <h2>{profile?.displayName || "No Name"}</h2>
              <p>{profile?.bio || "No bio available"}</p>
              <button
                className="button-freelancer-dashboard"
                onClick={() => navigate("/freelancer-form")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {currentSection === "my-gigs" && (
          <div>
            <h2 className="section-title">My Gigs</h2>
            <button
              className="button1-freelancer-dashboard"
              onClick={() => navigate("/create-gig")}
            >
              Create New Gig
            </button>
            <div className="list">
              {gigs.length > 0 ? (
                gigs.map((gig) => (
                  <div className="gig-card" key={gig.id}>
                    {gig.thumbnail && (
                      <img
                        className="gig-thumbnail"
                        src={gig.thumbnail}
                        alt={gig.title}
                      />
                    )}
                    <div className="gig-details">
                      <h3>{gig.title}</h3>
                      <p>{gig.description}</p>
                      <p>Price: ₹{gig.price}</p>
                      <p>Category: {gig.category}</p>
                    </div>
                    <div className="gig-actions">
                      <button className="button-freelancer-dashboard">
                        Edit
                      </button>
                      <button className="button-freelancer-dashboard">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-item">No gigs found</div>
              )}
            </div>
          </div>
        )}

      {currentSection === 'orders' && (
        <OrdersList /> // Use the OrdersList component here
      )}

        {currentSection === "messages" && (
          <div>
            <h2 className="section-title">Messages</h2>
            <div className="list">
              {/* Sample Message Items */}
              <div className="list-item">
                <h3>Conversation with Client</h3>
                <p>Last message preview</p>
              </div>
              {/* Repeat ListItem for each conversation */}
            </div>
          </div>
        )}

        {currentSection === "reviews" && (
          <div>
            <h2 className="section-title">Reviews</h2>
            <div className="list">
              {/* Sample Review Items */}
              <div className="list-item">
                <h3>Review from Client</h3>
                <p>Rating: ★★★☆☆</p>
                <p>Review text...</p>
              </div>
              {/* Repeat ListItem for each review */}
            </div>
          </div>
        )}

        {currentSection === "settings" && (
          <div>
            <h2 className="section-title">Account Settings</h2>
            <div className="profile-card">
              <h3>Personal Information</h3>
              <button className="button-freelancer-dashboard">
                Edit Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FreelancerDashboard;
