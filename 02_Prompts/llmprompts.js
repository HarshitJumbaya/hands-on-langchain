import dotenv from 'dotenv';
dotenv.config()

import { OpenAI } from '@langchain/openai';
import {PromptTemplate} from "@langchain/core/prompts";
const llm = new OpenAI({});

//Ex1 - Prompt having no input variable
const noInputPrompt = new PromptTemplate({
    inputVariables: [],
    template: "Tell me a trick of JavaScript"
})

const formattedNoInputPrompt = await noInputPrompt.format();
console.log("No Input Prompt: ", formattedNoInputPrompt);

const response = await llm.invoke(formattedNoInputPrompt);
console.log('Response: ', response);


//Ex2 - Prompt having 1 input variable
const oneInputPrompt = new PromptTemplate({
    inputVariables: ["language"],
    template: "Tell me a trick of {language}"
})

const formattedOneInputPrompt = await oneInputPrompt.format({
    language: "python"
});
console.log("One Input Prompt: ", formattedOneInputPrompt);

const response2 = await llm.invoke(formattedOneInputPrompt);
console.log('Response2: ', response2);


//Ex3 - Prompt having multiple input variable
const multipleInputPrompt = new PromptTemplate({
    inputVariables: ["language", "topic"],
    template: "Tell me a trick of {language} from {topic}"
})

const formattedMultipleInputPrompt = await multipleInputPrompt.format({
    language: "python",
    topic: "function"
});

const response3 = await llm.invoke(formattedMultipleInputPrompt);


//Ex3 - Prompt having multiple input variable
const multipleInputPrompt2 = PromptTemplate.fromTemplate("Tell me a trick of {language} from {topic}")

const formattedMultipleInputPrompt2 = await multipleInputPrompt2.format({
    language: "python",
    topic: "array"
});
console.log("Formatted Prompt template: ", formattedMultipleInputPrompt2);
console.log("Prompt template input variables: ", multipleInputPrompt2.inputVariables);
const response4 = await llm.invoke(formattedMultipleInputPrompt2);
console.log('Response4: ', response4);