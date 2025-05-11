const db = require("../config/db");

// Get all events, upcoming first, past later
const getEvents = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT * FROM events
            ORDER BY 
                CASE 
                    WHEN date_time >= NOW() THEN 0 
                    ELSE 1 
                END,
                date_time ASC
        `);
        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: 'No Events Found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'All Event Records',
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching events',
            error
        });
    }
};

// Get single event by ID
const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).send({
                success: false,
                message: 'Please provide event ID'
            });
        }

        const [data] = await db.query(`SELECT * FROM events WHERE id = ?`, [eventId]);
        if (!data.length) {
            return res.status(404).send({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).send({
            success: true,
            data: data[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching event by ID',
            error
        });
    }
};

// Create new event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            type,
            city,
            venue,
            date_time,
            food_available,
            cost,
            description,
            contact_number
        } = req.body;

        if (!title || !type || !city || !venue || !date_time || !contact_number) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const [data] = await db.query(
            `INSERT INTO events (title, type, city, venue, date_time, food_available, cost, description, contact_number)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, type, city, venue, date_time, food_available, cost, description, contact_number]
        );

        res.status(201).send({
            success: true,
            message: 'New event created successfully',
            eventId: data.insertId
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating event',
            error
        });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).send({
                success: false,
                message: 'Please provide event ID'
            });
        }

        const {
            title,
            type,
            city,
            venue,
            date_time,
            food_available,
            cost,
            description,
            contact_number
        } = req.body;

        const [data] = await db.query(
            `UPDATE events SET title = ?, type = ?, city = ?, venue = ?, date_time = ?, food_available = ?, cost = ?, description = ?, contact_number = ?
             WHERE id = ?`,
            [title, type, city, venue, date_time, food_available, cost, description, contact_number, eventId]
        );

        res.status(200).send({
            success: true,
            message: 'Event updated successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating event',
            error
        });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent
};
