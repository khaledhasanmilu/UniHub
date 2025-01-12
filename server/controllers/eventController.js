const db = require('../config/db');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, venue, type ,creator_id} = req.body;
    console.log(title, description, startDate, endDate, venue, type);
    
    const imageUrl = req.file
      ? `http://localhost:5000/uploads/images/${req.file.filename}`
      : null;
    console.log(imageUrl);

    const query = 'INSERT INTO events (title, description, start_time, end_time, venue, imageUrl, event_type,creator_id) VALUES (?, ?, ?, ?, ?, ?,?, ?);';

    db.execute(query, [title, description, startDate, endDate, venue, imageUrl, type,creator_id], (err, result) => {
      if (err) {
        console.error("Error saving event to database:", err.message);
        return res
          .status(500)
          .json({ message: "Error saving event", error: err.message });
      }

      console.log("Event created with ID:", result.insertId);
      return res.status(201).json({
        message: "Event created successfully",
        eventId: result.insertId,
        title,
        description,
        startDate,
        endDate,
        venue,
        imageUrl,
        type,
      });
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    console.log(req.body);
    const { filter } = req.body;
    const query = filter === 'all' ? 'SELECT * FROM events;' : 'SELECT * FROM events WHERE event_type = ?;';
    db.execute(query, [filter], (err, results) => {
      if (err) {
        console.error('Error fetching events:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
      res.status(200).json({
        success: true,
        events: results,
      });
    }
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, imageUrl } = req.body;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.location = location;
    event.imageUrl = imageUrl;
    await event.save();
    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

exports.deleteEvent = async (req, res) => { 
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    await event.destroy();
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}