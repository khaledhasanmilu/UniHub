import React from 'react';

function NoteCard({ courseCode, courseName, title, shortDescription, contentUrl, creator, createDate }) {
  console.log(courseCode, courseName, title, shortDescription, contentUrl, creator, createDate);  
  return (
    <div className="bg-white shadow-md rounded-md p-4 border border-gray-300">
      <h2 className="text-lg font-semibold text-blue-600">{title}</h2>
      <p className="text-sm text-gray-500">{shortDescription}</p>

      <div className="mt-2 text-sm text-gray-700">
        <p><strong>Course:</strong> {courseName} ({courseCode})</p>
        <p><strong>Created By:</strong> {creator}</p>
        <p><strong>Date:</strong> {new Date(createDate).toLocaleDateString()}</p>
      </div>

      <div className="mt-4">
        <a 
          href={contentUrl}
          target="_blank" 

          rel="noreferrer"
          className="text-blue-500"
        >
          View Content
        </a>
      </div>
    </div>
  );
}

export default NoteCard;
