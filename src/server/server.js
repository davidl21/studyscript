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

app.get("/qa", async (req, res) => {
  const query = req.query.message;
  if (message && typeof message === "string") {
    const response = await chain.invoke({
      context: "some typa similarity search",
      question: "",
    });
  }
});

app.get("/find_user", async (req, res) => {
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");

  const found_user = await myCollection.findOne({email: req.query.email});

  if (found_user) {
    console.log("found registered user in database.");
    res.status(400).json({
      message: "Email already registered."
    })
  } else {
    console.log("User not found in database.")
    res.status(200).json({
      message: "Email not yet registered."
    })
  }
})

app.post("/register", async (req, res) => {
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");

  try {
    // hash the password
    bcrypt.hash(req.query.password, 10).then(async (hashedPassword) => {
      // create new user instance and collect data
      const user = {
        user_id: req.query.user_id,
        email: req.query.email,
        password: hashedPassword,
        docs: null,
        transcript: null,
      };

      // insert data
      try {

        const result = await myCollection.insertOne(user);
        console.log("Successfully connected to DB and inserted user.");
      } catch (error) {
        res.status(500).send("Error adding user to database.");
        console.log(error);
      }
    });
    res.status(200).json({
      message: "Successfully registered user in database!",
    });
  } catch (error) {
    res.status(500).send("Error adding user to database.");
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  await client.connect();
  const myDatabase = client.db("studyscript");
  const myCollection = myDatabase.collection("users");

  await myCollection
    .findOne({ email: req.query.email })
    .then((user) => {
      bcrypt
        .compare(req.query.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Passwords do not match.",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          res.status(200).send({
            message: "Login successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "Passwords do not match",
            error,
          });
        });
    })
    .catch((e) => {
      res.status(404).send({
        message: "Email not foud",
        e,
      });
    });
});

app.post("/get-transcript", async (req, res) => {
  try {
    const url = req.query.url;

    const apiRes = await YoutubeTranscript.fetchTranscript(url);
    const combinedText = res.combineText(apiRes);

    console.log(combinedText)
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
    const result = await myCollection.updateOne(filter, updateDocument);
    res.status(200).json({
      message: "Successfully put documents into user database.",
    });
  } catch (error) {
    res.status(500).send("Error fetching transcript");
    console.log(error);
  }
});

app.get("/qa", async (req, res) => {
  try {
    const question = req.query.question;
    const user_id = req.query.user_id;
    const chatbot_res = await ANSWER(question, user_id);

    res.status(200).send(
      {
        ai_message: chatbot_res
      }
    )
  } catch (error) {
    res.status(500).send("Error generating chatbot answer");
    console.log(error);
  }
});

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

  const history = new ChatMessageHistory();

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
