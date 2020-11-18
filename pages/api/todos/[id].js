const pool = require("../../../lib/db");

export default async function todoHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const id = req.query.id;
        const getTodo = await pool.query(
          "SELECT * FROM todo WHERE todo_id = ($1)",
          [parseInt(id)]
        );
        console.log(`got a single todo for id: ${req.body.id}`, getTodo.rows);
        res.json(getTodo.rows);
      } catch (error) {
        console.log(error);
      }
      break;

    case "PUT":
      try {
        const id = parseInt(req.query.id);
        const { todo_desc, completed } = req.body;
        const updateTodo = await pool.query(
          "UPDATE todo SET todo_desc = ($1), completed = ($2) WHERE todo_id = ($3) RETURNING *",
          [todo_desc, completed, id]
        );
        console.log("successfully updated", updateTodo.rows);
        res.json(updateTodo.rows);
      } catch (error) {
        console.error(error);
      }

    case "DELETE":
      try {
        const deletedTodo = await pool.query(
          "DELETE FROM todo WHERE todo_id = ($1) RETURNING *",
          [req.query.id]
        );
        console.log(deletedTodo.rows, "successfully deleted");
        res.json(deletedTodo.rows);
      } catch (error) {
        console.log(error);
      }
    default:
      // res.setHeader('Allow', ['GET', 'PUT'])
      // res.status(405).end(`Method ${method} Not Allowed`)
      res.status(405);
  }
}
