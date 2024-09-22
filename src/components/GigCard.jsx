import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import defaultAvatar from "../assets/avatar.png";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  width: 300px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
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
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  text-align: center;
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

const FreelancerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  border: 2px solid #007bff;
`;

const FreelancerName = styled.p`
  font-size: 1rem;
  color: #333;
`;

const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();

  const handlePlaceOrder = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + gig.deliveryTime);

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
          thumbnail: gig.thumbnail,
        };

        await addDoc(collection(firestore, "orders"), orderData);
        navigate("/escrowComponent");
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
        const chatQuery = query(
          collection(firestore, "chats"),
          where("buyerId", "==", user.uid),
          where("freelancerId", "==", gig.freelancerId)
        );

        const chatSnapshot = await getDocs(chatQuery);
        let chatId;

        if (chatSnapshot.empty) {
          const chatData = {
            buyerId: user.uid,
            freelancerId: gig.freelancerId,
            gigId: gig.id,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
          };
          const chatDoc = await addDoc(collection(firestore, "chats"), chatData);
          chatId = chatDoc.id;
        } else {
          chatId = chatSnapshot.docs[0].id;
        }

        navigate(`/chat/${chatId}`);
      } catch (error) {
        console.error("Error starting chat: ", error);
      }
    } else {
      alert("You need to be logged in to start a chat.");
    }
  };

  const handleAvatarClick = async () => {
    try {
      const freelancerDoc = await getDoc(doc(firestore, "users", gig.freelancerId));
      if (freelancerDoc.exists()) {
        const freelancerData = freelancerDoc.data();
        navigate(`/freelancer/${gig.freelancerId}`, { state: { freelancer: freelancerData } });
      } else {
        alert("Freelancer not found.");
      }
    } catch (error) {
      console.error("Error fetching freelancer details: ", error);
    }
  };

  // Determine the avatar image to display
  const avatarImage = gig.freelancerAvatar ? gig.freelancerAvatar : defaultAvatar;

  return (
    <Card>
      {/* Freelancer Info Section */}
      <FreelancerInfo onClick={handleAvatarClick}>
        <Avatar src={avatarImage} alt="Freelancer Avatar" />
        <FreelancerName>{gig.freelancerName}</FreelancerName>
      </FreelancerInfo>
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
