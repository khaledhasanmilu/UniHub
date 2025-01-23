import React from 'react'

function NoteCard({ title, content }) {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  )
}

export default NoteCard;
