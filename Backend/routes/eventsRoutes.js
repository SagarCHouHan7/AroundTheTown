// const express = require('express');
// const {
//     getEvents,
//     getEventById,
//     createEvent,
//     updateEvent
// } = require('../controllers/eventController');

// // Create router object
// const router = express.Router();

// // Routes

// // Get all events || GET
// router.get('/events', getEvents);

// // Get event by ID || GET
// router.get('/events/:id', getEventById);

// // Create new event || POST
// router.post('/events', createEvent);

// // Update event by ID || PUT
// router.put('/events/:id', updateEvent);

// // Export router
// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all events
router.get("/", async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events ORDER BY event_date_time ASC");
    res.status(200).send({
      success: true,
      message: "Fetched all events",
      data: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching events",
      error,
    });
  }
});

// POST create event
router.post("/", async (req, res) => {
  try {
    const {
      title,
      type,
      city,
      venue,
      dateTime,
      foodAvailable,
      cost,
      description,
      contact,
      imageUrl,
    } = req.body;

    if (!title || !type || !city || !venue || !dateTime || !contact) {
      return res.status(400).send({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const insertQuery = `
     
    INSERT INTO events 
(title, event_type, city, venue, event_date_time, food_available, participation_cost, description, contact, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    const [result] = await db.query(insertQuery, [
      title,
      type,
      city,
      venue,
      dateTime,
      foodAvailable,
      cost,
      description,
      contact,
      imageUrl || null,
    ]);

    res.status(201).send({
      success: true,
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error creating event",
      error,
    });
  }
});

// GET event by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Fetched event",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching event",
      error,
    });
  }
});


module.exports = router;

