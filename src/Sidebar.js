// Sidebar.js
import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
`;

const UserItem = styled.div`
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #e4e4e4;
  }
`;

const Sidebar = ({ users, onUserClick }) => {
  return (
    <SidebarContainer>
      {users.map(user => (
        <UserItem key={user.id} onClick={() => onUserClick(user)}>
          {user.name}
        </UserItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
