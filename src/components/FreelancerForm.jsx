// src/components/FreelancerForm.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { useProfile } from './ProfileContext'; // Import useProfile

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const FormField = styled.div`
  margin: 10px 0;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const FreelancerForm = () => {
  const { profile, setProfile } = useProfile();
  const [formValues, setFormValues] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSkillChange = (e) => {
    const { options } = e.target;
    const selectedSkills = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormValues({ ...formValues, skills: selectedSkills });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formValues); // Update profile context with form data
    // Navigate to FreelancerProfile
    // Use your navigation logic here
  };

  return (
    <FormContainer>
      <h1>Freelancer Profile</h1>
      <FormField>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <Label htmlFor="bio">Bio:</Label>
        <TextArea
          id="bio"
          name="bio"
          value={formValues.bio}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <Label htmlFor="skills">Skills:</Label>
        <Select
          id="skills"
          name="skills"
          multiple
          value={formValues.skills}
          onChange={handleSkillChange}
        >
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="CSS">CSS</option>
          <option value="HTML">HTML</option>
        </Select>
      </FormField>
      <FormField>
        <Label htmlFor="category">Category:</Label>
        <Select
          id="category"
          name="category"
          value={formValues.category}
          onChange={handleInputChange}
        >
          <option value="">Select a category</option>
          <option value="Websites_IT_Software">Websites, IT & Software</option>
          <option value="Writing_Content">Writing & Content</option>
          <option value="Design_Media_Architecture">Design, Media & Architecture</option>
          <option value="Data_Entry_Admin">Data Entry & Admin</option>
          <option value="Engineering_Science">Engineering & Science</option>
          <option value="Sales_Marketing">Sales & Marketing</option>
          <option value="Business_Accounting_HR_Legal">Business, Accounting, HR & Legal</option>
          <option value="Product_Sourcing_Manufacturing">Product Sourcing & Manufacturing</option>
          <option value="Mobile_Phones_Computing">Mobile Phones & Computing</option>
          <option value="Translation_Languages">Translation & Languages</option>
          <option value="Trades_Services">Trades & Services</option>
          <option value="Freight_Shipping_Transportation">Freight, Shipping & Transportation</option>
          <option value="Telecommunications">Telecommunications</option>
          <option value="Education">Education</option>
          <option value="Health_Medicine">Health & Medicine</option>
          <option value="Artificial_Intelligence">Artificial Intelligence</option>
        </Select>
      </FormField>
      <FormField>
        <Label htmlFor="photo">Upload Photo:</Label>
        <Input
          type="file"
          id="photo"
          name="photo"
          onChange={(e) => setFormValues({ ...formValues, photo: e.target.files[0] })}
        />
      </FormField>
      <SubmitButton type="submit" onClick={handleSubmit}>Save Changes</SubmitButton>
    </FormContainer>
  );
};

export default FreelancerForm;
