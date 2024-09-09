import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Home from "./Home";
import UserTypeSelection from "./components/UserTypeSelection";
import FreelancerDashboard from "./FreelancerDashboard";
import BuyerDashboard from "./BuyerDashboard.js";

const MainHome = () => {
  const [role, setRole] = useState(null); // State to store user role
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
            console.log(userData.role); // Set the user's role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      setLoading(false); // Stop loading once role is fetched
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state while fetching the role
  }

  if (role === 'user') {
    return <UserTypeSelection />;
  } else if (role === 'freelancer') {
    return <FreelancerDashboard />;
  } else if (role === 'buyer') {
    return <BuyerDashboard />;
  } else {
    return <Home />;
  }
};

export default MainHome;
