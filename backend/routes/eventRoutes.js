import express from "express";
import db from "../db.js";

const router = express.Router();

// CREATE EVENT
router.post("/", async (req, res) => {
  try {
    const {
      organizer_id,
      title,
      description,
      location,
      latitude,
      longitude,
      event_date,
      start_time,
      end_time,
    } = req.body;

    if (!organizer_id || !title || !event_date) {
      return res.status(400).json({
        message: "Organizer ID, title and event date are required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO events
       (organizer_id, title, description, location,
        latitude, longitude, event_date, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        organizer_id,
        title,
        description || null,
        location || null,
        latitude || null,
        longitude || null,
        event_date,
        start_time || null,
        end_time || null,
      ],
    );

    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: result.insertId,
        organizer_id,
        title,
        description,
        location,
        event_date,
        start_time,
        end_time,
      },
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET EVENTS OF ORGANIZER
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;

    const [events] = await db.execute(
      `SELECT *
       FROM events
       WHERE organizer_id = ?
       ORDER BY event_date DESC`,
      [organizerId],
    );

    res.json(events);
  } catch (error) {
    console.error("Get Organizer Events Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
export default router;
