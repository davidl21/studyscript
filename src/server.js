import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.listen(3000, () => console.log("App is listening on port 3000."));
