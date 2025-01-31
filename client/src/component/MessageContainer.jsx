import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Cookies from "js-cookie";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_SERVER_URL = "http://localhost:5000";
const API_SERVER_URL = "http://localhost:5000/api"; // Your backend API endpoint

const MessageContainer = ({ user }) => {
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Get current user from cookies
  const currentUser = Cookies.get("uid") || "Guest";

  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);

    // Register the user when they connect
    socket.current.emit("registerUser", currentUser);

    // Fetch previous messages from backend
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_SERVER_URL}/chat/getChat/${user.id}`, {
         withCredentials: true,
        }
        );
        const data = await response.data;
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      if (
        (String(message.sender) === String(currentUser) && String(message.receiver) === String(user.id)) ||
        (String(message.sender) === String(user.id) && String(message.receiver) === String(currentUser))
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user.id, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: currentUser,
        receiver: user.id,
        text: newMessage.trim(),
      };

      console.log("Sending message:", messageData);
      socket.current.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-white shadow-md rounded-md">
      <div className="bg-blue-500 text-white text-center text-lg font-semibold p-3 rounded-t-md">
        Chat with {user.name}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 h-[380px] scrollbar-hide">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${String(msg.sender) === String(currentUser) ? "justify-end" : "justify-start"}`}>
          <div className={`p-3 max-w-[60%] text-white rounded-lg ${String(msg.sender) === String(currentUser) ? "bg-blue-500" : "bg-gray-400"}`}>
            {msg.text}
          </div>
        </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-md" onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default MessageContainer;
