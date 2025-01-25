const db = require('../config/db');


const getChat = (req, res) => {
  
  const user_id = req.cookies.uid;
  const query = `SELECT 
    conversation_partners.user_id AS id, 
    u.name AS name, 
    u.profile_picture AS image, 
    MAX(conversation_partners.timestamp) AS last_message_time
FROM (
    SELECT 
        CASE 
            WHEN m.sender_id = ? THEN m.receiver_id 
            ELSE m.sender_id 
        END AS user_id, 
        m.timestamp
    FROM messages m
    WHERE m.sender_id = ? OR m.receiver_id = ?
) AS conversation_partners
JOIN users u ON u.user_id = conversation_partners.user_id
GROUP BY conversation_partners.user_id, u.name, u.profile_picture
ORDER BY last_message_time DESC
;
`;
  db.query(query, [user_id, user_id,user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(result);
  } 
  );
    
}

const getChatById = (req, res) => {
  const other_user = req.params.id;
  const user_id = req.cookies.uid;

  console.log("Fetching chat between:", user_id, other_user);

  const query = `
    SELECT sender_id AS sender, receiver_id AS receiver, text, timestamp 
    FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
    ORDER BY timestamp ASC
  `;

  db.query(query, [user_id, other_user, other_user, user_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(result);
  });
};

const getUsersById = (req, res) => {
  const user_id = req.params.id;
  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    console.log("User:", result[0]);
    res.json(result[0]);
  });
};

module.exports = {getChat, getChatById, getUsersById};