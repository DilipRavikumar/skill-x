import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  text-align: center;
`;

const Button = styled.button`
  background: #007bff;
  color: #fff;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    if (type === 'freelancer') {
      navigate('/freelancer-form'); // Navigate to FreelancerForm
    } else if (type === 'employer') {
      navigate('/employer-form'); // Navigate to EmployerForm (if you have one)
    }
  };

  return (
    <SelectionContainer>
      <h1>Are you a freelancer or an employer?</h1>
      <Button onClick={() => handleSelection('freelancer')}>Freelancer</Button>
      <Button onClick={() => handleSelection('employer')}>Employer</Button>
    </SelectionContainer>
  );
};

export default UserTypeSelection;
