// ChatList.js
import React from 'react';
import styled from 'styled-components';

const ChatListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ChatItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: ${props => (props.selected ? '#e9ecef' : '#fff')};

  &:hover {
    background-color: #f1f1f1;
  }
`;

const ChatList = ({ chats, onChatSelect, selectedChatId }) => {
  return (
    <ChatListContainer>
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          selected={chat.id === selectedChatId}
          onClick={() => onChatSelect(chat.id)}
        >
          {chat.name} {/* Customize this based on your chat data */}
        </ChatItem>
      ))}
    </ChatListContainer>
  );
};

export default ChatList;
