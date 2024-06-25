import dotenv from 'dotenv';
dotenv.config()

import { OpenAI, ChatOpenAI, OpenAIClient } from '@langchain/openai';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Parsing/ retrieving only the string part in AI message in response 4
const parser = new StringOutputParser(); 

// LLM
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const response = await llm.invoke("who is prime minister of india")
// const response = await llm("who is prime minister of india")

console.log(response);


// CHAT MODEL
const chat = new ChatOpenAI({});
const response2 = await chat.invoke("Which is the most used tech stack used worldwide?");
console.log('Response2', response2);

// eg 2 chat model

const model = new ChatOpenAI({model : "gpt-4"});
// const chat2 = new ChatOpenAI({});

const messages = [
    new SystemMessage("Translate the following from English to French"),
    new HumanMessage("hi!"),
];


const response3 = await model.invoke(messages);
const response4 = await parser.invoke(response3);
console.log('Response4', response4);
