// USAGE

// GET all locations
// POST add a new location needs - city

import client from "../../../lib/db";

export default async function locationsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const locations = await client.query(
          "SELECT * FROM locations ORDER BY location_id"
        );
        console.log(locations.rows, "got these for all locations");
        res.json(locations.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    case "POST":
      try {
        const { city } = req.body;
        const newLocation = await client.query(
          "INSERT INTO locations (city) VALUES ($1) RETURNING *",
          [city]
        );
        console.log(newLocation.rows[0], "added this location");
        res.json(newLocation.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    default:
      res.status(405);
  }
}
