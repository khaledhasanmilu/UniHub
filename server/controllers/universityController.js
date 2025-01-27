const db = require('../config/db');

exports.getUniversities = (req, res) => {
    const query = `SELECT * FROM universities`;
    db.execute(query, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
      } else {
        res.json(result);
      }
    });
  };
exports.addUniversities = (req, res) => {
    const { name, location, website } = req.body;
    const query = `INSERT INTO universities (name, location, website) VALUES (?, ?, ?)`;
    db.execute(query, [name, location, website], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
      } else {
        res.json({ message: 'University added successfully' });
      }
    });
  };