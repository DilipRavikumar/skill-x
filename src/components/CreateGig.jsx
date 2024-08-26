import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  max-width: 900px;
  margin: 50px auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin: 15px 0;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: #fff;
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const RemoveTag = styled.span`
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 12px;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  input {
    border: none;
    font-size: 1rem;
    width: 100%;
    &:focus {
      outline: none;
    }
  }
`;

const CalendarIcon = styled(FaCalendarAlt)`
  margin-right: 10px;
  color: #007bff;
`;

const CreateGig = () => {
  const [gigDetails, setGigDetails] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    budget: '',
    deliveryTime: new Date(),
    skillsRequired: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [user, setUser] = useState(null);
  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGigDetails({ ...gigDetails, [name]: value });
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setGigDetails((prevState) => ({
        ...prevState,
        skillsRequired: [...prevState.skillsRequired, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setGigDetails((prevState) => ({
      ...prevState,
      skillsRequired: prevState.skillsRequired.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleDateChange = (date) => {
    setGigDetails((prevState) => ({
      ...prevState,
      deliveryTime: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const gigData = {
          ...gigDetails,
          userEmail: user.email,
          createdAt: new Date(),
        };

        // Add a new document with a generated ID to the 'gigs' collection
        await addDoc(collection(firestore, 'gigs'), gigData);
        console.log('Gig successfully created!');
        // Optionally, redirect to another page or show a success message
      } catch (error) {
        console.error('Error creating gig: ', error);
      }
    } else {
      console.error('No user is signed in');
    }
  };

  return (
    <FormContainer>
      <Title>Create a Gig</Title>
      <form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="title">Title:</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={gigDetails.title}
            onChange={handleInputChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="category">Category:</Label>
          <Select
            id="category"
            name="category"
            value={gigDetails.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="writing-translation">Writing & Translation</option>
            <option value="design-creative">Design & Creative</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="programming-tech">Programming & Tech</option>
            <option value="video-animation">Video & Animation</option>
            <option value="music-audio">Music & Audio</option>
            <option value="business">Business</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="gaming">Gaming</option>
            <option value="data">Data</option>
            <option value="ecommerce">E-commerce</option>
            <option value="education">Education</option>
            <option value="legal">Legal</option>
            <option value="photography">Photography</option>
            <option value="social-media">Social Media</option>
            <option value="virtual-assistant">Virtual Assistant</option>
            <option value="translation">Translation</option>
            <option value="copywriting">Copywriting</option>
            <option value="technical-writing">Technical Writing</option>
            <option value="mobile-apps">Mobile Apps</option>
            <option value="web-development">Web Development</option>
            <option value="software-development">Software Development</option>
            <option value="networking">Networking</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="cloud-computing">Cloud Computing</option>
          </Select>
        </FormField>
        <FormField>
          <Label htmlFor="subcategory">Subcategory:</Label>
          <Input
            id="subcategory"
            name="subcategory"
            type="text"
            value={gigDetails.subcategory}
            onChange={handleInputChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="description">Description:</Label>
          <TextArea
            id="description"
            name="description"
            rows="5"
            value={gigDetails.description}
            onChange={handleInputChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="budget">Budget:</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            value={gigDetails.budget}
            onChange={handleInputChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="deliveryTime">Delivery Time:</Label>
          <DatePickerWrapper>
            <CalendarIcon size={20} />
            <DatePicker
              selected={gigDetails.deliveryTime}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </DatePickerWrapper>
        </FormField>
        <FormField>
          <Label htmlFor="skillsRequired">Skills Required:</Label>
          <div>
            <Input
              id="skillsRequired"
              type="text"
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleSkillKeyPress}
              placeholder="Press Enter to add skill"
            />
            <TagList>
              {gigDetails.skillsRequired.map((skill, index) => (
                <Tag key={index}>
                  {skill}
                  <RemoveTag onClick={() => handleRemoveSkill(skill)}>×</RemoveTag>
                </Tag>
              ))}
            </TagList>
          </div>
        </FormField>
        <SubmitButton type="submit">Create Gig</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default CreateGig;
