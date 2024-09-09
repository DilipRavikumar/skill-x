import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import GigCard from "./components/GigCard"; // Assuming you have a GigCard component to display individual gigs

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;

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
      <SectionTitle>My Orders</SectionTitle>
      <OrderList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderCardTitle>{order.gigTitle}</OrderCardTitle>
            <OrderCardDetails>Price: ₹{order.price}</OrderCardDetails>
            <OrderCardDetails>Status: {order.status}</OrderCardDetails>
            <OrderCardDetails>Delivery Date: {order.deliveryDate.toDate().toLocaleDateString()}</OrderCardDetails>
            {/* Add more details or actions as needed */}
          </OrderCard>
        ))}
      </OrderList>
    </DashboardContainer>
  );
};

export default BuyerDashboard;
