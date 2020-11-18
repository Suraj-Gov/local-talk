import pool from "../../../lib/db";

export default async function locationsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const locations = await pool.query(
          "SELECT * FROM locations ORDER BY location_id"
        );
        console.log(locations.rows, "got these for all locations");
        res.json(locations.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "POST":
      try {
        const { location_x, location_y, user_id, location_data } = req.body;
        const newLocation = await pool.query(
          "INSERT INTO locations (location_x, location_y, user_id, location_data) VALUES ($1, $2, $3, $4) RETURNING *",
          [location_x, location_y, user_id, location_data]
        );
        console.log(newLocation.rows[0], "added this location");
        res.json(newLocation.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    default:
      res.status(405);
  }
}
