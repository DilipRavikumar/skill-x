import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import GigCard from "./components/GigCard"; // Assuming you have a GigCard component to display individual gigs
import { FaBriefcase, FaBox } from "react-icons/fa"; // Import icons for sidebar
import BuyerOrderList from "./components/BuyerOrderList";

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-right: 1px solid #ddd;
  position: fixed; /* Fix the sidebar in place */
  top: 60px; /* Adjust this value to account for the header height */
  left: 0;
  height: calc(100vh - 60px); /* Adjust height to be below the header */
  z-index: 1; /* Lower z-index so it stays behind the header */
`;

const SidebarButton = styled.button`
  background: transparent;
  color: #6c757d;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 100%;
  text-align: left;

  &:hover {
    background: #e9ecef;
    color: rgb(1, 11, 231);
  }

  &.active {
    background: #007bff;
    color: #ffffff;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 80px;
  margin-left: 250px; /* Offset for the sidebar */
  position: relative;
`;

const Header = styled.header`
  background: #ffffff;
  color: rgb(0, 0, 0);
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed; /* Fix the header in place */
  top: 0;
  left: 0;
  width: 100%; /* Full width */
  z-index: 2; /* Higher z-index to ensure it overlaps the sidebar */
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-left:120px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const GigList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const OrderList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderCardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 10px;
`;

const OrderCardDetails = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
`;

const BuyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("available-gigs");
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const q = query(collection(firestore, "gigs"));
        const querySnapshot = await getDocs(q);
        const fetchedGigs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGigs(fetchedGigs);
        setFilteredGigs(fetchedGigs);
      } catch (error) {
        console.error("Error fetching gigs: ", error);
      }
    };

    const fetchOrders = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const q = query(
            collection(firestore, "orders"),
            where("buyerId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const fetchedOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders: ", error);
        }
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchGigs(), fetchOrders()]);
      setLoading(false);
    };

    fetchData();
  }, [auth, firestore]);

  useEffect(() => {
    const filterGigs = () => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = gigs.filter((gig) =>
        gig.title.toLowerCase().includes(lowercasedSearchTerm) ||
        gig.description.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredGigs(filtered);
    };

    filterGigs();
  }, [searchTerm, gigs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarButton
          className={currentSection === "available-gigs" ? "active" : ""}
          onClick={() => setCurrentSection("available-gigs")}
        >
          <FaBriefcase className="icon" /> <span>Available Gigs</span>
        </SidebarButton>
        <SidebarButton
          className={currentSection === "order-history" ? "active" : ""}
          onClick={() => setCurrentSection("order-history")}
        >
          <FaBox className="icon" /> <span>Order History</span>
        </SidebarButton>
      </Sidebar>
      <MainContent>
        <Header>
          <HeaderTitle>Skill-X Buyer Dashboard</HeaderTitle>
        </Header>
        {currentSection === "available-gigs" && (
          <>
            <SearchBar
              type="text"
              placeholder="Search for gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SectionTitle>Available Gigs</SectionTitle>
            <GigList>
              {filteredGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </GigList>
          </>
        )}
        {currentSection === "order-history" && (
          <>
             <BuyerOrderList/>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default BuyerDashboard;
