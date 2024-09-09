import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
`;

const Button = styled.button`
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();

  const handlePlaceOrder = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Calculate delivery date
        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + gig.deliveryTime);

        // Collect order details
        const orderData = {
          gigId: gig.id,
          gigTitle: gig.title,
          gigPrice: gig.price,
          gigCategory: gig.category,
          buyerId: user.uid,
          freelancerId: gig.freelancerId,
          status: "Pending",
          price: gig.price,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
          deliveryDate: Timestamp.fromDate(deliveryDate),
          messageThread: [],
          review: null,
        };

        // Add the order to Firestore
        await addDoc(collection(firestore, "orders"), orderData);
        
        // Optionally, navigate to an order confirmation page or show a success message
        alert("Order placed successfully!");
        navigate("/dashboard-buyer"); // Redirect to BuyerDashboard or appropriate page
      } catch (error) {
        console.error("Error placing order: ", error);
      }
    } else {
      alert("You need to be logged in to place an order.");
    }
  };

  return (
    <Card>
      <Title>{gig.title}</Title>
      <Description>{gig.description}</Description>
      <Button onClick={handlePlaceOrder}>Place Order</Button>
    </Card>
  );
};

export default GigCard;
