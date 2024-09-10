import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerDashboard.css";
import { useProfile } from "./components/ProfileContext";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  FaUser,
  FaBriefcase,
  FaBox,
  FaEnvelope,
  FaStar,
  FaCog,
} from "react-icons/fa";
import OrdersList from "./components/OrdersList";
import FreelancerProfile from "./components/FreelancerProfile";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FreelancerDashboard = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("my-gigs");
  const [gigs, setGigs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch gigs created by the logged-in freelancer
          const gigsQuery = query(
            collection(firestore, "gigs"),
            where("freelancerId", "==", user.uid)
          );
          const querySnapshot = await getDocs(gigsQuery);
          const fetchedGigs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGigs(fetchedGigs);

          // Set up real-time message listener
          const messagesQuery = query(
            collection(firestore, "chats"),
            where("freelancerId", "==", user.uid)
          );
          const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              fetchedMessages.push({
                chatId: doc.id,
                ...data,
                messages: data.messages || [],
              });
            });
            setMessages(fetchedMessages);
          });

          return () => unsubscribeMessages();

        } catch (error) {
          console.error("Error fetching gigs or messages: ", error);
        }
      } else {
        setGigs([]);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleEditGig = (gigId) => {
    navigate(`/edit-gig/${gigId}`);
  };

  const handleDeleteGig = async (gigId) => {
    try {
      await deleteDoc(doc(firestore, "gigs", gigId));
      setGigs(gigs.filter((gig) => gig.id !== gigId));
    } catch (error) {
      console.error("Error deleting gig: ", error);
    }
  };

  const handleEditSettings = () => {
    navigate('/freelancer-form');
  };

  const uploadImage = async (file) => {
    const imageRef = ref(storage, `chat-images/${file.name}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  const handleSendMessage = async () => {
    if (selectedChatId && (newMessage.trim() || imageFile)) {
      try {
        const messageData = {
          senderId: auth.currentUser.uid,
          text: newMessage.trim() || "",
          imageUrl: imageFile ? await uploadImage(imageFile) : "",
          timestamp: new Date(),
        };

        // Update the chat document with the new message
        await updateDoc(doc(firestore, "chats", selectedChatId), {
          messages: arrayUnion(messageData),
        });

        setNewMessage("");
        setImageFile(null); // Reset the image file
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleChatSelection = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Skill-X Freelancer Dashboard</h1>
      </header>
      <aside className="sidebar">
        <div className="sidebar-button-container">
          <button
            className={`sidebar-button ${
              currentSection === "profile" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("profile")}
          >
            <FaUser className="icon" /> <span>Profile Overview</span>
          </button>
          <button
            className={`sidebar-button ${
              currentSection === "my-gigs" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("my-gigs")}
          >
            <FaBriefcase className="icon" /> <span>My Gigs</span>
          </button>
          <button
            className={`sidebar-button ${
              currentSection === "orders" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("orders")}
          >
            <FaBox className="icon" /> <span>Orders</span>
          </button>
          <button
            className={`sidebar-button ${
              currentSection === "messages" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("messages")}
          >
            <FaEnvelope className="icon" /> <span>Messages</span>
          </button>
          <button
            className={`sidebar-button ${
              currentSection === "reviews" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("reviews")}
          >
            <FaStar className="icon" /> <span>Reviews</span>
          </button>
          <button
            className={`sidebar-button ${
              currentSection === "settings" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("settings")}
          >
            <FaCog className="icon" /> <span>Account Settings</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {currentSection === "profile" && (
          <div>
            <FreelancerProfile />
          </div>
        )}

        {currentSection === "my-gigs" && (
          <div>
            <h2 className="section-title">My Gigs</h2>
            <button
              className="button1-freelancer-dashboard"
              onClick={() => navigate("/create-gig")}
            >
              Create New Gig
            </button>
            <div className="list">
              {gigs.length > 0 ? (
                gigs.map((gig) => (
                  <div className="gig-card" key={gig.id}>
                    {gig.thumbnail && (
                      <img
                        className="gig-thumbnail"
                        src={gig.thumbnail}
                        alt={gig.title}
                      />
                    )}
                    <div className="gig-details">
                      <h3>{gig.title}</h3>
                      <p>{gig.description}</p>
                      <p>Price: ₹{gig.price}</p>
                      <p>Category: {gig.category}</p>
                    </div>
                    <div className="gig-actions">
                      <button
                        className="button-freelancer-dashboard"
                        onClick={() => handleEditGig(gig.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="button-freelancer-dashboard"
                        onClick={() => handleDeleteGig(gig.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-item">No gigs found</div>
              )}
            </div>
          </div>
        )}

        {currentSection === "orders" && (
          <OrdersList />
        )}

        {currentSection === "messages" && (
          <div>
            <h2 className="section-title">Messages</h2>
            <div className="list">
              {messages.length > 0 ? (
                messages.map((chat) => (
                  <div className="list-item" key={chat.chatId} onClick={() => handleChatSelection(chat.chatId)}>
                    <h3>Conversation with {chat.buyerId}</h3>
                    <div className="message-list">
                      {chat.messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderId === auth.currentUser?.uid ? "sent" : "received"}`}>
                          {msg.text && <p>{msg.text}</p>}
                          {msg.imageUrl && <img src={msg.imageUrl} alt="message attachment" className="message-image" />}
                          <span>{new Date(msg.timestamp.toDate()).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <button className="button-send" onClick={handleSendMessage}>Send</button>
                  </div>
                ))
              ) : (
                <div className="list-item">No messages found</div>
              )}
            </div>
          </div>
        )}

        {currentSection === "reviews" && (
          <div>
            <h2 className="section-title">Reviews</h2>
            {/* Review functionality can be implemented here */}
          </div>
        )}

        {currentSection === "settings" && (
          <div>
            <h2 className="section-title">Account Settings</h2>
            <button
              className="button-freelancer-dashboard"
              onClick={handleEditSettings}
            >
              Edit Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FreelancerDashboard;
