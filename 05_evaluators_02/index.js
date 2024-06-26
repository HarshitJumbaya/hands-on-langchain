import dotenv from 'dotenv';
dotenv.config()
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { evaluate } from "langsmith/evaluation";
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Please review the user query below and determine if it contains any form of toxic behavior, such as insults, threats, or highly negative comments. Respond with 'Toxic' if it does, and 'Not toxic' if it doesn't.",
  ],
  ["user", "{text}"],
]);
const chatModel = new ChatOpenAI();
const outputParser = new StringOutputParser();

const chain = prompt.pipe(chatModel).pipe(outputParser);


await evaluate(chain, {
  data: datasetName,
  evaluators: [correctLabel],
  experimentPrefix: "Toxic Queries",
});