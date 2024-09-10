import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
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

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
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

const ChatButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
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
          thumbnail: gig.thumbnail // Add the thumbnail to the order data
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

  const handleStartChat = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Check if a chat room already exists between buyer and freelancer
        const chatQuery = query(
          collection(firestore, "chats"),
          where("buyerId", "==", user.uid),
          where("freelancerId", "==", gig.freelancerId)
        );

        const chatSnapshot = await getDocs(chatQuery);
        let chatId;

        if (chatSnapshot.empty) {
          // Create a new chat room if one does not exist
          const chatData = {
            buyerId: user.uid,
            freelancerId: gig.freelancerId,
            gigId: gig.id,
            createdAt: Timestamp.fromDate(new Date()),
            messages: []
          };
          const chatDoc = await addDoc(collection(firestore, "chats"), chatData);
          chatId = chatDoc.id;
        } else {
          chatId = chatSnapshot.docs[0].id;
        }

        // Navigate to the chat page with the chat ID
        navigate(`/chat/${chatId}`);
      } catch (error) {
        console.error("Error starting chat: ", error);
      }
    } else {
      alert("You need to be logged in to start a chat.");
    }
  };

  return (
    <Card>
      {/* Display the thumbnail */}
      <Thumbnail src={gig.thumbnail} alt={gig.title} />
      <Title>{gig.title}</Title>
      <Description>{gig.description}</Description>
      <Button onClick={handlePlaceOrder}>Place Order</Button>
      <ChatButton onClick={handleStartChat}>Chat with Freelancer</ChatButton>
    </Card>
  );
};

export default GigCard;
