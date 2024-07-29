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

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.9,
  apiKey: "",
});

const embeddings = new OpenAIEmbeddings({
  apiKey: "",
  model: "text-embedding-3-small",
});

// Character splitting & document retrieval
const text = "hello";// retrieve from db
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// FAISS store
const vectorStore = await FaissStore.fromDocukments(
  docs,
  embeddings
)

const retriever = vectorStore.asRetriever();

const history = new ChatMessageHistory();

const prompt = PromptTemplate.fromTemplate(
  `You are a friendly AI chatbot built to help students learn and answer questions regarding their lecture material. 

  Based on the context given you, only answer questions about the context or that is related to the context. 

  Do not hold conversations about topics or subjects unrelated to the context.

  Have a friendly yet professional tone, like that of a tutor. 
  
    Answer the question based only on the following context:
    {context}

    Question: {question}
    `
);
