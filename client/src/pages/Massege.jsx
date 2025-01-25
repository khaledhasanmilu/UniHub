import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 
import io from "socket.io-client"; // Import socket.io client
import MassegeCard from "../component/MessegeCard";
import MassegeContainer from "../component/MessageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

// Connect to the socket server
const socket = io("http://localhost:5000"); // Replace with your backend URL

const Massege = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/getChat`, {
          withCredentials: true,
        });

        const usersList = response.data;

        // Add the user from the URL (`id`) if not already in the list
        const userFromUrl = usersList.find((user) => user.id === parseInt(id));
        if (userFromUrl) {
          // If the user is already in the list, set them as selected
          setSelectedUser(userFromUrl);
        } else {
          // If the user is not in the list, fetch and add them to the top
          const user = await axios.get(`http://localhost:5000/api/chat/getUser/${id}`,);
          
          const newUser = {
            id: parseInt(id),
            name: 'New User', // Fetch user data from your API as necessary
            image: 'https://randomuser.me/api/portraits/men/0.jpg', // Mock image for now
          };
          console.log(id);
          if(id){
            // const response = await axios.post(`http://localhost:5000/api/chat/addChat`, {
            //   withCredentials: true,
            //   user: newUser
            // });
            // console.log("response",response);
            usersList.unshift(newUser); // Add the new user to the top
          }
           // Add the new user to the top
          setSelectedUser(newUser); // Set as selected user
        }

        setUsers(usersList);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    // Listen for real-time updates when a new message is received
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      // Optionally, you can fetch messages again or update the UI dynamically
    });

    return () => {
      socket.off("newMessage"); // Cleanup socket listener
    };
  }, [id]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    navigate(`/messages/${user.id}`); 
  };

  const sortedUsers = users.sort((a, b) => {
    if (parseInt(id) === a.id) return -1; // Move the selected user to the top
    if (parseInt(id) === b.id) return 1;  // Move the selected user to the top
    return 0; // Keep other users in their original order
  });

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-100 mx-8">
      <div className="bg-white shadow-md rounded-md min-h-[calc(100vh-100px)] max-w-6xl w-full mx-60 p-5">
        <div className="flex">
          <div className="w-[calc(100vh/2.2)] max-h-[calc(100vh-110px)] overflow-y-auto">
            {users.length > 0 && (
              <>
                <div className="bg-blue-500 text-white text-center text-lg font-semibold p-3 rounded-t-md">
                  <span className="ml-2 flex items-center justify-evenly">
                    Messages
                    <FontAwesomeIcon icon={faComment} />
                  </span>
                </div>

                {sortedUsers.map((user) => (
                  <div key={user.id} onClick={() => handleUserSelect(user)} className="cursor-pointer">
                    <MassegeCard name={user.name} image={user.image} />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex-1">
            {selectedUser ? (
              <MassegeContainer user={selectedUser} socket={socket} />
            ) : (
              <p className="text-center text-gray-500">No user selected</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Massege;
