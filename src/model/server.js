import express from "express";
import cors from "cors";
import needle from "needle";
import { YoutubeTranscript } from "youtube-transcript";
import rateLimit from "express-rate-limit";
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB Deployment
const uri = "mongodb+srv://davidl21:ShX2jDrspIYuDMo1@cluster0.4qtdodj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1, 
    strict: true,
    depcrecationErrors: true,
  }
});

async function run() {
  try {
    // connect the client to the server
    await client.connect();

    // send a ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const app = express();

// Combine text chunks from youtube-transcript api
const combineText = (req, res, next) => {
  res.combineText = (transcripts) => {
    const combinedText = transcripts.map(chunk => chunk.text).join(' ');
    return combinedText;
  };
  next();
}
app.use('/get-transcript', combineText);

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

app.get("/get-transcript", async (req, res) => {
  try {
    const apiRes = await YoutubeTranscript.fetchTranscript(
      "https://www.youtube.com/watch?v=KSAPc5NwLYU"
    );
    
    const combinedText = res.combineText(apiRes);
    res.json({ combinedText })
  } catch (error) {
    res.status(500).send('Error fetching transcript');
  }
});

app.listen(3000, () => console.log("App is listening on port 3000."));
