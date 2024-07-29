import express from "express";
import cors from "cors";
import needle from "needle";
import { YoutubeTranscript } from "youtube-transcript";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.get("/transcript", async (req, res) => {
  const apiRes = await YoutubeTranscript.fetchTranscript(
    "https://www.youtube.com/watch?v=KSAPc5NwLYU"
  );
  res.send(apiRes);
});

app.listen(3000, () => console.log("App is listening on port 3000."));
