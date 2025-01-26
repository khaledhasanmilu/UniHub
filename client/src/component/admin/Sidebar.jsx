const Sidebar = ({ onSelectOption }) => {
  return (
    <div className="bg-gray-800 text-white w-64 p-4">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => onSelectOption('dashboard')}
            className="sidebar-option w-full text-left p-2 rounded hover:bg-gray-700"
          >
            Total Users
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectOption('userActivity')}
            className="sidebar-option w-full text-left p-2 rounded hover:bg-gray-700"
          >
            User Activity
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectOption('mostLikedPosts')}
            className="sidebar-option w-full text-left p-2 rounded hover:bg-gray-700"
          >
            Most Liked Posts
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectOption('mostEngagedUsers')}
            className="sidebar-option w-full text-left p-2 rounded hover:bg-gray-700"
          >
            Most Engaged Users
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;