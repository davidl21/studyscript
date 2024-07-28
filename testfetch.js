import { YoutubeTranscript } from "youtube-transcript";

const response = await YoutubeTranscript.fetchTranscript(
  "https://www.youtube.com/watch?v=4bgL-4v3quk"
);
console.log(response);
