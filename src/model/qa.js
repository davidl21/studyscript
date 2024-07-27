import { HuggingFaceInference } from "langchain/llms/hf";
import * as dotenv from "dotenv";

dotenv.config();

const model = new HuggingFaceInference({
    model:"gpt2",
    apiKey: process.env.HUGGINGFACE_API_KEY
});

async function run() {
    try {
        const res = await model.invoke("1 + 1 =");
        console.log({ res });
    } catch (erorr) {
        console.error("Error:", error);
    }
}

run();