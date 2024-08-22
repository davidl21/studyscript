import express from "express";
import cors from "cors";
import needle from "needle";
import { YoutubeTranscript } from "youtube-transcript";
import rateLimit from "express-rate-limit";
import { MongoClient, ServerApiVersion } from "mongodb";
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
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");
  // only create a new chathistory if the user is not in the database yet.
  const user = await myCollection.findOne({ user_id: user_id });

  let history;
  if (user && user.chatHistory) {
    console.log("User history exists in database.");
    history = user.chatHistory;
  } else {
    console.log("User history does not exist in database.");
    history = [];

    await myCollection.insertOne({ user_id: user_id, chatHistory: history });
  }

  return history;
};

const updateChatHistory = async (chatHistory, user_id) => {
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");

  try {
    await myCollection.updateOne(
      { user_id: user_id },
      { $set: { chatHistory: chatHistory } }
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
  const user = await myCollection.findOne({ user_id: user_id });
  const docs = user.docs;

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
