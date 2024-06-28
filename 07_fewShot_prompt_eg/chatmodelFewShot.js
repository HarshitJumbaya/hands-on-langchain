import {ChatOpenAI} from "@langchain/openai";
import {
    FewShotPromptTemplate,
    FewShotChatMessagePromptTemplate,
  } from "langchain/prompts";
  import {
    ChatPromptTemplate,
  
  } from "langchain/prompts";
import dotenv from 'dotenv'
dotenv.config()

const chat = new ChatOpenAI({});

const examples = [
    {
      input: "Could the members of The Police perform lawful arrests?",
      output: "what can the members of The Police do?",
    },
    {
      input: "Jan Sindel's was born in what country?",
      output: "what is Jan Sindel's personal history?",
    },
  ];
  const prompt = `Human: {input}
  AI: {output}`;
  const examplePromptTemplate = PromptTemplate.fromTemplate(prompt);
  const exampleChatPromptTemplate = ChatPromptTemplate.fromTemplate(prompt);
  const chatFewShotPrompt = new FewShotChatMessagePromptTemplate({
    examplePrompt: exampleChatPromptTemplate,
    examples,
    inputVariables: [], // no input variables
  });
  const fewShotPrompt = new FewShotPromptTemplate({
    examplePrompt: examplePromptTemplate,
    examples,
    inputVariables: [], // no input variables
  });
  console.log("Chat Few Shot: ", await chatFewShotPrompt.formatMessages({}));