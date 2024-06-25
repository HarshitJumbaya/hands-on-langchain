import dotenv from 'dotenv';
import {
    ChatPromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
  } from "@langchain/core/prompts";
  import {
    AIMessage,
    HumanMessage,
    SystemMessage,
  } from "@langchain/core/messages";
import {ChatOpenAI} from "@langchain/openai"

dotenv.config();

const chat = new ChatOpenAI({});

// ex1 : message prompt template as tuples
const sys_template = "You are a helput assistant that translates {input_language} to {output_language}.";

const human_template = "{text}";

const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", sys_template],
    ["human", human_template],
])

const formattedChatPrompt = await chatPrompt.formatMessages({
    input_language: "English",
    output_language: "French",
    text: "I am learning LangChain Js"
})

const response = await chat.invoke(formattedChatPrompt);
console.log(response);


// Ex2 : using message classes
const sys_template2 = "You are a helpful assistant that translates {input_language} to {output_language}."

const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant that translates {input_language} to {output_language}.");
const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate("{text}");

const chatPrompt2 = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt])
console.log(chatPrompt2.inputVariables);  // for extracting input variables that are ['input_language', 'output_language', 'text'] here

const formattedChatPrompt2 = await chatPrompt2.format({
    input_language: "English",
    output_language: "French",
    text: "I love programming"
})

const response2 = await chat.invoke(formattedChatPrompt2);
console.log(response2);


// Ex3 - using PromptTemplate
const systemPrompt = new PromptTemplate({
    template: "You are a helpful assistant that translates {input_language} to {output_language}.",
    inputVariables: ["input_language", "output_language"]
})
const humanPrompt = new PromptTemplate({
    template: "{text}",
    inputVariables: ["text"]
})

const systemMessagePrompt2 = new SystemMessagePromptTemplate({prompt: systemPrompt});
const humanMessagePrompt2 = new HumanMessagePromptTemplate({prompt: humanPrompt});

const chatPrompt3 = ChatPromptTemplate.fromMessages([
    systemMessagePrompt2, humanMessagePrompt2
]);
const formattedChatPrompt3 = await chatPrompt3.formatMessages({
    input_language: "English",
    output_language: "French",
    text: "Currently working on langchain"
})
const response3 = await chat.invoke(formattedChatPrompt3);
console.log(response3.content);