import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from './components/ProfileContext'; // Update path as needed
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import OrdersList from './components/OrdersList'

// Styled components for layout
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #343a40;
  color: #ffffff;
  padding: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.main`
  margin-left: 270px;
  padding: 20px;
  background: #ffffff;
  min-height: 100vh;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 20px;
  color: #007bff;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const ProfileCard = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const GigCard = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const GigThumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
`;

const GigDetails = styled.div`
  flex: 1;
`;

const GigActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 15px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ListItem = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FreelancerDashboard = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('my-gigs');
  const [gigs, setGigs] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch gigs created by the logged-in freelancer
        try {
          const gigsQuery = query(
            collection(firestore, 'gigs'),
            where('freelancerId', '==', user.uid)
          );
          const querySnapshot = await getDocs(gigsQuery);
          const fetchedGigs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setGigs(fetchedGigs);
        } catch (error) {
          console.error('Error fetching gigs: ', error);
        }
      } else {
        setGigs([]);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Skill-X Freelancer Dashboard</h1>
      </Header>
      <Sidebar>
        <Button onClick={() => handleSectionChange('profile')}>Profile Overview</Button>
        <Button onClick={() => handleSectionChange('my-gigs')}>My Gigs</Button>
        <Button onClick={() => handleSectionChange('orders')}>Orders</Button>
        <Button onClick={() => handleSectionChange('messages')}>Messages</Button>
        <Button onClick={() => handleSectionChange('reviews')}>Reviews</Button>
        <Button onClick={() => handleSectionChange('settings')}>Account Settings</Button>
      </Sidebar>
      <MainContent>
        {currentSection === 'profile' && (
          <div>
            <SectionTitle>Profile Overview</SectionTitle>
            <ProfileCard>
              <ProfileImage src={profile?.profileImage || '/default-profile.png'} alt="Profile" />
              <h2>{profile?.displayName || 'No Name'}</h2>
              <p>{profile?.bio || 'No bio available'}</p>
              <Button onClick={() => navigate('/freelancer-form')}>Edit Profile</Button>
            </ProfileCard>
          </div>
        )}

        {currentSection === 'my-gigs' && (
          <div>
            <SectionTitle>My Gigs</SectionTitle>
            <Button onClick={() => navigate('/create-gig')}>Create New Gig</Button>
            <List>
              {gigs.length > 0 ? (
                gigs.map(gig => (
                  <GigCard key={gig.id}>
                    {gig.thumbnail && <GigThumbnail src={gig.thumbnail} alt={gig.title} />}
                    <GigDetails>
                      <h3>{gig.title}</h3>
                      <p>{gig.description}</p>
                      <p>Price: ₹{gig.price}</p>
                      <p>Category: {gig.category}</p>
                    </GigDetails>
                    <GigActions>
                      <Button>Edit</Button>
                      <Button>Delete</Button>
                    </GigActions>
                  </GigCard>
                ))
              ) : (
                <ListItem>No gigs found</ListItem>
              )}
            </List>
          </div>
        )}

      {currentSection === 'orders' && (
        <OrdersList /> // Use the OrdersList component here
      )}

        {currentSection === 'messages' && (
          <div>
            <SectionTitle>Messages</SectionTitle>
            <List>
              {/* Sample Message Items */}
              <ListItem>
                <h3>Conversation with Client</h3>
                <p>Last message preview</p>
              </ListItem>
              {/* Repeat ListItem for each conversation */}
            </List>
          </div>
        )}

        {currentSection === 'reviews' && (
          <div>
            <SectionTitle>Reviews</SectionTitle>
            <List>
              {/* Sample Review Items */}
              <ListItem>
                <h3>Review from Client</h3>
                <p>Rating: ★★★☆☆</p>
                <p>Review text...</p>
              </ListItem>
              {/* Repeat ListItem for each review */}
            </List>
          </div>
        )}

        {currentSection === 'settings' && (
          <div>
            <SectionTitle>Account Settings</SectionTitle>
            {/* Personal and Payment Settings Form */}
            <ProfileCard>
              <h3>Personal Information</h3>
              <Button onClick={() => navigate('/settings/personal')}>Edit Personal Info</Button>
              <h3>Payment Settings</h3>
              <Button onClick={() => navigate('/settings/payment')}>Edit Payment Info</Button>
            </ProfileCard>
          </div>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default FreelancerDashboard;
