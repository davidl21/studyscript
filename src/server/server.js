import express from "express";
import cors from "cors";
import needle from "needle";
import { YoutubeTranscript } from "youtube-transcript";
import rateLimit from "express-rate-limit";
import { MongoClient, ServerApiVersion } from "mongodb";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

// MongoDB Deployment
const uri =
  "mongodb+srv://davidl21:ShX2jDrspIYuDMo1@cluster0.4qtdodj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    depcrecationErrors: true,
  },
});

async function run() {
  try {
    // connect the client to the server
    await client.connect();
    // send a ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const app = express();

// Combine text chunks from youtube-transcript api - middleware
const combineText = (req, res, next) => {
  res.combineText = (transcripts) => {
    const combinedText = transcripts.map((chunk) => chunk.text).join(" ");
    return combinedText;
  };
  next();
};
app.use("/get-transcript", combineText);

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5,
});

app.use(limiter);
app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// HTTP Requests
app.get("/", (req, res) => {
  res.send("Successful response.");
});

app.post("/get-transcript", async (req, res) => {
  try {
    const url = req.query.url;

    const apiRes = await YoutubeTranscript.fetchTranscript(url);
    const combinedText = res.combineText(apiRes);

    //console.log(combinedText);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([combinedText]);
    //console.log(docs);

    // connect to mongodb
    await client.connect();
    const myDatabase = client.db("studyscript");
    const myCollection = myDatabase.collection("users");

    // put docs into mongodb database
    const filter = { user_id: req.query.user_id };
    const updateDocument = {
      $set: {
        docs: docs,
      },
    };
    await myCollection.updateOne(filter, updateDocument);
    res.status(200).json({
      message: "Successfully put documents into user database.",
    });
  } catch (error) {
    res.status(500).send("Error fetching transcript");
    console.log(error);
  }
});

app.get("/qa", async (req, res) => {
  const question = req.query.question;
  const user_id = req.query.user_id;
  if (!question || typeof question !== "string" || question.trim() === "") {
    try {
      const chatbot_res = await ANSWER(question, user_id);

      res.status(200).send({
        ai_message: chatbot_res,
      });
    } catch (error) {
      res.status(500).send("Error generating chatbot answer");
      console.log(error);
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid input.",
    });
  }
});

const getChatHistory = async (user_id) => {
  // only create a new chathistory if the user is not in the database yet.
  const user = await userCollection.findOne({ user_id: user_id });
  let history;
  if (user && user.chatHistory) {
    history = new ChatMessageHistory(user.chatHistory);
  } else {
    history = new ChatMessageHistory();

    await userCollection.insertOne({ user_id: user_id, chatHistory: history });
  }

  return history;
};

// langchain rag qa model
const ANSWER = async (query, user_id) => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.9,
    apiKey: "",
  });

  const embeddings = new OpenAIEmbeddings({
    apiKey: "",
    model: "text-embedding-3-small",
  });

  // FAISS store
  const docs = "pull from user db.";
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever();
  const history = await getChatHistory(user_id);

  const promptTemplate = PromptTemplate.fromTemplate(
    `You are a friendly AI chatbot built to help students learn and answer questions regarding their lecture material. 

    Based on the context given you, only answer questions about the context or that is related to the context. 

    Do not hold conversations about topics or subjects unrelated to the context.

    Have a friendly yet professional tone, like that of a tutor. 
    
      Answer the question based only on the following context:
      {context}

      Question: {question}
      `
  );

  const chain = promptTemplate.pipe(model);
};

app.listen(3000, () => console.log("App is listening on port 3000."));
