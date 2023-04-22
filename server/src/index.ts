import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Example");
});

app.listen(8000, () => {
  console.log("Server listening port", 8000);
});
