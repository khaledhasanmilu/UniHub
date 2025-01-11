import React from 'react';

const dummyMessages = [
    { id: 1, user: 'Alice', message: 'Hi there!' },
    { id: 2, user: 'Bob', message: 'Hello! How are you?' },
    { id: 3, user: 'Alice', message: 'I am good, thanks! What about you?' },
    { id: 4, user: 'Bob', message: 'I am doing well, thank you!' },
];

const Massege = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="flex-1">
              
                <div className=" p-8 ml-64 max-w-6xl">
                    <div className="text-2xl font-bold mb-4 text-gray-800">Chat with User</div>
                    <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded shadow">
                        {dummyMessages.map(msg => (
                            <div key={msg.id} className={`p-3 my-2 rounded-lg max-w-md ${msg.user === 'Alice' ? 'bg-blue-100 self-start' : 'bg-green-100 self-end'}`}>
                                <strong className="text-gray-700">{msg.user}:</strong> <span className="text-gray-600">{msg.message}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-4">
                        <input type="text" placeholder="Type a message" className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">Send</button>
             </div>
            </div>
        </div>
        </div>
    );
};

export default Massege;