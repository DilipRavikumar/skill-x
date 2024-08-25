// src/components/FreelancerProfile.js

import React from 'react';
import { useProfile } from './ProfileContext'; // Import useProfile
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const ProfileDetail = styled.div`
  margin: 10px 0;
  width: 100%;
`;

const Label = styled.h2`
  font-size: 1.2rem;
  color: #333;
`;

const FreelancerProfile = () => {
  const { profile } = useProfile();

  return (
    <ProfileContainer>
      {profile.photo && <ProfileImage src={URL.createObjectURL(profile.photo)} alt="Profile" />}
      <ProfileDetail>
        <Label>Name:</Label>
        <p>{profile.name}</p>
      </ProfileDetail>
      <ProfileDetail>
        <Label>Bio:</Label>
        <p>{profile.bio}</p>
      </ProfileDetail>
      <ProfileDetail>
        <Label>Skills:</Label>
        <p>{profile.skills.join(', ')}</p>
      </ProfileDetail>
      <ProfileDetail>
        <Label>Category:</Label>
        <p>{profile.category}</p>
      </ProfileDetail>
    </ProfileContainer>
  );
};

export default FreelancerProfile;
