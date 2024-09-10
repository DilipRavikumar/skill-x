import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Home from "./Home";
import UserTypeSelection from "./components/UserTypeSelection";
import FreelancerDashboard from "./FreelancerDashboard";
import BuyerDashboard from "./BuyerDashboard";

const MainHome = () => {
  const [role, setRole] = useState(null); // State to store user role
  const [loading, setLoading] = useState(true); // State to handle loading
  const [user, setUser] = useState(null); // State to store authenticated user

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRole(currentUser.uid);
      } else {
        setRole(null);
        setLoading(false); // Stop loading if no user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const fetchUserRole = async (uid) => {
    const db = getFirestore();
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role); // Set the user's role
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    setLoading(false); // Stop loading once role is fetched
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state while fetching the role
  }

  return (
    <>
      {role === "user" && <UserTypeSelection />}
      {role === "freelancer" && <FreelancerDashboard />}
      {role === "buyer" && <BuyerDashboard />}
      {!user && <Home />} {/* Show Home if no user is authenticated */}
    </>
  );
};

export default MainHome;
