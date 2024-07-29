import express from "express";
import cors from "cors";
import needle from "needle";
import { YoutubeTranscript } from "youtube-transcript";
import rateLimit from "express-rate-limit";

const app = express();

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5,
});

app.use(limiter);
app.set("trust proxy", 1);

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
