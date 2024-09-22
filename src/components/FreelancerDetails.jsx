import React from "react";
import { useParams, useLocation } from "react-router-dom";
import defaultAvatar from "../assets/avatar.png"; // Update the path to your default avatar image
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #007bff;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h1`
  font-size: 26px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const Detail = styled.p`
  font-size: 16px;
  color: #555;
  margin: 8px 0;
  width: 100%;
  text-align: left;
`;

const Strong = styled.strong`
  color: #007bff;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const FreelancerDetails = () => {
  const { id } = useParams(); // Get the freelancer ID from the URL
  const location = useLocation();
  const freelancer = location.state?.freelancer; // Get freelancer details from state

  if (!freelancer) {
    return <div>No freelancer data found.</div>;
  }

  return (
    <Container>
      <Avatar src={freelancer.profileImage || defaultAvatar} alt="Freelancer Avatar" />
      <Title>{freelancer.displayName}</Title>
      <Detail>
        <Strong>Bio:</Strong> {freelancer.bio}
      </Detail>
      <Detail>
        <Strong>Email:</Strong> {freelancer.email}
      </Detail>
      <Detail>
        <Strong>Role:</Strong> {freelancer.role}
      </Detail>
      <Detail>
        <Strong>Rating:</Strong> {freelancer.rating} ⭐
      </Detail>
      <Detail>
        <Strong>Balance:</Strong> ${freelancer.balance}
      </Detail>
      <Detail>
        <Strong>Completed Orders:</Strong> {freelancer.completedOrders}
      </Detail>
      <Detail>
        <Strong>Skills:</Strong> {freelancer.skills.join(", ")}
      </Detail>
      <Detail>
        <Strong>Username:</Strong> {freelancer.username}
      </Detail>
      <Button>Contact Freelancer</Button>
    </Container>
  );
};

export default FreelancerDetails;
