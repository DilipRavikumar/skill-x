import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';
import Picker from 'emoji-picker-react'; // Default export
import { FaImage, FaSmile } from 'react-icons/fa'; // Import image and emoji icons

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 600px;
  max-width: 100%;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  align-self: center;
`;

const Title = styled.h2`
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: ${props => (props.senderId === props.currentUserId ? "#d4edda" : "#e2e3e5")};
  align-self: ${props => (props.senderId === props.currentUserId ? 'flex-end' : 'flex-start')};
  max-width: 80%;
  align-items: ${props => (props.senderId === props.currentUserId ? 'flex-end' : 'flex-start')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageText = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

const MessageTimestamp = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
  background: #ffffff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1) inset;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SendButton = styled.button`
  background: #007bff;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
`;

const ImageUpload = styled.input`
  display: none;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 70px;
  right: 60px;
  z-index: 1000;
  background: transparent; /* Remove background */
  border: none; /* Remove border */
  box-shadow: none; /* Remove box-shadow */
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ImageIcon = styled(FaImage)`
  cursor: pointer;
  color: #007bff;
  font-size: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;

const EmojiIcon = styled(FaSmile)`
  cursor: pointer;
  color: #007bff;
  font-size: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;

const Chat = ({ selectedChat }) => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [freelancerId, setFreelancerId] = useState("");
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(firestore, "chats", chatId);

    const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setMessages(data.messages || []);
        setFreelancerId(data.freelancerId || "Freelancer");
      } else {
        console.error("Chat document does not exist.");
      }
    });

    return () => unsubscribe();
  }, [chatId, firestore]);

  const handleSendMessage = async () => {
    if (!chatId) return;

    const user = auth.currentUser;
    if (user && (newMessage.trim() || image)) {
      try {
        const chatRef = doc(firestore, "chats", chatId);

        const newMessageData = {
          text: newMessage,
          senderId: user.uid,
          timestamp: Timestamp.fromDate(new Date()),
          image: image || null,
        };

        await updateDoc(chatRef, {
          messages: [...messages, newMessageData]
        });

        setNewMessage("");
        setImage(null);
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    } else {
      alert("You need to be logged in to send a message.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji.emoji);
    setEmojiPickerVisible(false);
  };

  return (
    <ChatContainer>
      <Title>Conversation with {freelancerId}</Title>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} senderId={msg.senderId} currentUserId={auth.currentUser?.uid}>
            <MessageText>
              <strong>{msg.senderId === auth.currentUser?.uid ? "You" : "Freelancer"}:</strong>
              {msg.text}
              {msg.image && <img src={msg.image} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} />}
            </MessageText>
            <MessageTimestamp>{format(msg.timestamp.toDate(), 'MMM d, yyyy h:mm a')}</MessageTimestamp>
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <InputWrapper>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <IconWrapper>
            <label>
              <ImageUpload
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <ImageIcon />
            </label>
            <EmojiIcon onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} />
            {emojiPickerVisible && (
              <EmojiPickerWrapper>
                <Picker onEmojiClick={handleEmojiSelect} />
              </EmojiPickerWrapper>
            )}
          </IconWrapper>
          <SendButton onClick={handleSendMessage}>Send</SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
