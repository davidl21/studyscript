import express from "express";
import cors from "cors";
import { YoutubeTranscript } from "youtube-transcript";
import rateLimit from "express-rate-limit";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BufferMemory } from "langchain/memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import {
  ConversationChain,
  ConversationalRetrievalQAChain,
} from "langchain/chains";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "../../src/models/User.js";
import crypto from "crypto";

// MongoDB Deployment
const uri =
  "mongodb+srv://davidl21:ShX2jDrspIYuDMo1@cluster0.4qtdodj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function startServer() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB");
    // Start the server and perform any initial setup
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
startServer();

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

app.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      // if the user doesn't exist create a new user
    }
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error,
    });
  }
});

app.post("/get-transcript", async (req, res) => {
  try {
    console.log("test");
    const url = req.query.url;

    const apiRes = await YoutubeTranscript.fetchTranscript(url);
    const combinedText = res.combineText(apiRes);

    console.log(combinedText);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([combinedText]);
    console.log(docs);

    const user_id = req.query.user_id;
    const user = await User.findOneAndUpdate(
      { user_id },
      { $set: { docs } },
      { new: true, upsert: true }
    );

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
  if (question) {
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

const APIKEY = "";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.9,
  apiKey: APIKEY,
});

const embeddings = new OpenAIEmbeddings({
  apiKey: APIKEY,
  model: "text-embedding-3-small",
});

const getChatHistory = async (user_id) => {
  const user = await User.findOne({ user_id });

  if (user) {
    return user.chatHistory;
  } else {
    return [];
  }
};

const updateChatHistory = async (chatHistory, user_id) => {
  try {
    await User.findOneAndUpdate(
      { user_id },
      { $set: { chatHistory } },
      { new: true, upsert: true }
    );
    console.log("Successfully updated chat history.");
  } catch (error) {
    console.error("Failed to update chat history:", error);
    throw error;
  }
};

// langchain rag qa model
const ANSWER = async (query, user_id) => {
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");

  // fetch docs from database
  const user = await User.findOne({ user_id });
  const docs = user?.docs || [];

  // create vector store
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever();

  const prompt = PromptTemplate.fromTemplate(
    `You are a friendly AI chatbot built to help students learn and answer questions regarding their lecture material. 

    Based on the context given you, only answer questions about the context or that is related to the context. 

    Do not hold conversations about topics or subjects unrelated to the context.

    Use the following chat history if it helps you answer the user's questions:
    chat history: {chat_history}

    Have a friendly yet professional tone, like that of a tutor. 
    
      Answer the question based only on the following context:
      {context}

      Question: {question}
      `
  );

  let history = await getChatHistory(user_id);

  const chain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });

  try {
    const response = await chain.invoke({
      chat_history: history,
      context: retriever.invoke(query),
      question: query,
    });

    // update chat history and add chat history to database
    history = history.concat(response);
    console.log(history);
    await updateChatHistory(history, user_id);

    return response;
  } catch (error) {
    console.error("Error in ANSWER function", error);
    throw new Error("Failed to generate an answer");
  }
};

app.listen(3000, () => console.log("App is listening on port 3000."));
