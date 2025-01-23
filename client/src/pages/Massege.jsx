import React, { useState } from "react";
import MassegeCard from "../component/MessegeCard";
import MassegeContainer from "../component/MessageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

// Dummy message list
const dummyMessageUsers = [
  { id: 1, name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, name: "Bob", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 3, name: "Charlie", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 4, name: "David", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 5, name: "Emma", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 6, name: "Frank", image: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 7, name: "Grace", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 8, name: "Henry", image: "https://randomuser.me/api/portraits/men/5.jpg" },
  { id: 9, name: "Ivy", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  { id: 10, name: "Jack", image: "https://randomuser.me/api/portraits/men/6.jpg" },
];

const Massege = () => {
  // State to track the selected user
  const [selectedUser, setSelectedUser] = useState(dummyMessageUsers[0]); // Default to first user

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-100 mx-8">
      <div className="bg-white shadow-md rounded-md min-h-[calc(100vh-100px)] max-w-6xl w-full mx-60 p-5">
        <div className="flex">
          {/* Sidebar with scrollbar */}
          <div className="w-[calc(100vh/2.2)] max-h-[calc(100vh-110px)] overflow-y-auto">
            <div className="bg-blue-500 text-white text-center text-lg font-semibold p-3 rounded-t-md">
              <span className="ml-2 flex items-center justify-evenly">
                Messages
                <FontAwesomeIcon icon={faComment} />
              </span>
            </div>

            {dummyMessageUsers.map((user) => (
              <div key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer">
                <MassegeCard name={user.name} image={user.image} />
              </div>
            ))}
          </div>

          {/* Message content */}
          <div className="flex-1">
            <MassegeContainer userId={selectedUser.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Massege;
