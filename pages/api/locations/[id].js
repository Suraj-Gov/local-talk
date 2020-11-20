const pool = require("../../../lib/db");

export default async function locationsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const location_id = req.query.id;
        const getLocation = await pool.query(
          "SELECT * FROM locations WHERE location_id = ($1)",
          [location_id]
        );
        if (getLocation.rows[0] === undefined) {
          res.json({ message: "location not found" });
          return;
        }
        console.log(getLocation.rows[0]);
        res.json(getLocation.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    default:
      res.status(405);
  }
}
