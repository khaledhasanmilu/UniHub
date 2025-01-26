import { FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import moment from "moment";
const uid = Cookies.get("uid");

const NoteCard = ({courseCode, courseName, title, contentUrl, shortDescription, creator, createId, createDate, noteId, handleEditNote, handleDeleteNote}) => {
  
  const onDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await handleDeleteNote(noteId);
    }
  };

  const onEdit = (noteId) => {
    handleEditNote(noteId);
  };
 // console.log(createId, uid);

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 mt-2 transition-all transform hover:scale-105 hover:shadow-xl w-full max-w-lg">
      <h3 className="text-xl font-semibold text-gray-900 truncate">{title}</h3>
      <p className="text-sm text-gray-700 font-medium mt-1">{courseCode} - {courseName}</p>
      <p className="text-sm text-gray-600 mt-3 line-clamp-3">{shortDescription}</p>
      <p className="text-xs text-gray-400 mt-4">Created by <span className="font-medium text-gray-800">{creator}</span> on {moment(createDate).fromNow()}</p>
      
      <div className="flex justify-between items-center mt-5">
        <a
          href={contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-medium flex items-center gap-1 hover:underline hover:text-indigo-800 transition-all"
        >
          View Note <FaExternalLinkAlt className="text-sm" />
        </a>
        
        {String(createId) === String(uid) && (
          <div className="flex gap-4">
            <FaEdit
              className="text-blue-500 hover:text-blue-700 cursor-pointer transition-all transform hover:scale-110"
              title="Edit Note"
              onClick={() => onEdit(noteId)}
            />
            <FaTrash
              className="text-red-500 hover:text-red-700 cursor-pointer transition-all transform hover:scale-110"
              title="Delete Note"
              onClick={() => onDelete(noteId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
