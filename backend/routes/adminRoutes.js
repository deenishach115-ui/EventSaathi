import express from "express";
import db from "../db.js";

const router = express.Router();

/* =========================
   1. ALL USERS
========================= */

router.get("/users", async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT 
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   2. DASHBOARD STATISTICS
========================= */

router.get("/stats", async (req, res) => {
  try {
    const [[professionals]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'professional'
    `);

    const [[organizers]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'organizer'
    `);

    const [[events]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM events
    `);

    const [[present]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM attendance
      WHERE status = 'present'
      AND DATE(check_in) = CURDATE()
    `);

    res.json({
      professionals: professionals.total,
      organizers: organizers.total,
      events: events.total,
      presentToday: present.total,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   3. PROFESSIONALS
========================= */

router.get("/professionals", async (req, res) => {
  try {
    const [professionals] = await db.execute(`
      SELECT
        u.id,
        u.name,
        u.email,
        p.phone,
        p.skills,
        p.experience_years,
        p.city,
        p.availability,
        p.rating
      FROM users u

      INNER JOIN professional_profiles p
      ON u.id = p.user_id

      WHERE u.role = 'professional'

      ORDER BY u.id DESC
    `);

    res.json(professionals);
  } catch (error) {
    console.error("Get Professionals Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   4. ORGANIZERS
========================= */

router.get("/organizers", async (req, res) => {
  try {
    const [organizers] = await db.execute(`
      SELECT
        u.id,
        u.name,
        u.email,
        o.organization_name,
        o.phone,
        o.city,
        o.status,
        o.created_at,

        COUNT(e.id) AS total_events

      FROM users u

      LEFT JOIN organizer_profiles o
      ON u.id = o.user_id

      LEFT JOIN events e
      ON u.id = e.organizer_id

      WHERE u.role = 'organizer'

      GROUP BY
        u.id,
        u.name,
        u.email,
        o.organization_name,
        o.phone,
        o.city,
        o.status,
        o.created_at

      ORDER BY u.id DESC
    `);

    res.json(organizers);
  } catch (error) {
    console.error("Get Organizers Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   5. EVENTS
========================= */

router.get("/events", async (req, res) => {
  try {
    const [events] = await db.execute(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.start_time,
        e.end_time,
        e.status,

        u.name AS organizer_name,

        COUNT(
          CASE
            WHEN es.status = 'confirmed'
            THEN es.id
          END
        ) AS workers

      FROM events e

      INNER JOIN users u
      ON e.organizer_id = u.id

      LEFT JOIN event_staff es
      ON e.id = es.event_id

      GROUP BY
        e.id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.start_time,
        e.end_time,
        e.status,
        u.name

      ORDER BY e.event_date DESC
    `);

    res.json(events);
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   6. ATTENDANCE
========================= */

router.get("/attendance", async (req, res) => {
  try {
    const [attendance] = await db.execute(`
      SELECT
        a.id,

        u.name AS professional_name,

        e.title AS event_name,

        es.role,

        a.check_in,
        a.check_out,
        a.status,
        a.location_verified

      FROM attendance a

      INNER JOIN users u
      ON a.professional_id = u.id

      INNER JOIN events e
      ON a.event_id = e.id

      LEFT JOIN event_staff es
      ON es.event_id = a.event_id
      AND es.professional_id = a.professional_id

      ORDER BY a.check_in DESC
    `);

    res.json(attendance);
  } catch (error) {
    console.error("Get Attendance Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
