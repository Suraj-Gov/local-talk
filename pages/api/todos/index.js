const pool = require("../../../lib/db")

export default async function todoHandler(req, res) {
  const {method} = req;

  switch (method) {
    case 'GET':
      try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
        console.log(allTodos.rows, "got these for get all");
        res.json(allTodos.rows);
      } catch (error) {
        console.error(error);
      }
      break
    case 'POST':
      try {
        const { todo_desc, completed } = req.body;
        const newTodo = await pool.query(
          "INSERT INTO todo (todo_desc, completed) VALUES ($1,$2) RETURNING *",
          [todo_desc, completed]
        );
        res.json(newTodo);
        console.log(newTodo.rows, "added");
      } catch (error) {
        console.error(error);
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}