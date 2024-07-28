import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.9,
  apiKey: "",
});

const history = new ChatMessageHistory();

const prompt = PromptTemplate.fromTemplate(
  `Answer the question based only on the following context:
    {context}

    Question: {question}
    `
);
