import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

const loader = YoutubeLoader.createFromUrl(
  "https://www.youtube.com/watch?v=KSAPc5NwLYU",
  {
    language: "en",
    addVideoInfo: true,
  }
);

const docs = await loader.load();

console.log(docs);

// const response = await YoutubeTranscript.fetchTranscript(
//   "https://www.youtube.com/watch?v=4bgL-4v3quk"
// );
// console.log(response);
