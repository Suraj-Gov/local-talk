export default function HelloHandler(req, res) {
  const { method } = req;

  if (method === "GET") {
    res.json({ hey: "hi" });
    return;
  } else return res.status(500);
}
