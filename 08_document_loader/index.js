import dotenv from 'dotenv';
dotenv.config();

import {ChatOpenAI} from "@langchain/openai";
import {HumanMessagePromptTemplate, ChatPromptTemplate} from "@langchain/core/prompts";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {CSVLoader} from "langchain/document_loaders/fs/csv";
const chat = new ChatOpenAI({});


// Example 1 - Text File
const loader = new TextLoader("data/sample.txt");
const mydata = await loader.load();
console.log("My data:", mydata);
console.log("My data:", mydata[0]);
console.log("My data:", mydata[0].pageContent);
console.log("My data:", mydata[0].metadata);



// Example 2 - CSV File
// const loader2 = new TextLoader("data/sample.csv");
// const mydata2 = await loader2.load();
// console.log("My data:", mydata2);
// console.log("My data:", mydata2[0].pageContent);


// // example 3 PDF file
// const loader3 = new TextLoader("data/sample.pdf");
// const mydata3 = await loader3.load();
// console.log("My data:", mydata3);
// console.log("My data:", mydata3[0].pageContent);


//Example 4

const loader4 = new TextLoader("data/legal.txt");
const mydata4 = await loader4.load();
const my_legal_doc = mydata4[0].pageContent;

const human_template = "{question}\n{company_legal_doc}"
const chatPrompt = ChatPromptTemplate.fromMessages([
    ["human", human_template]
])

const formattedChatPrompt = await chatPrompt.formatMessages({
    question: "How can i apply for PAN card",
    company_legal_doc: my_legal_doc
})

const response = await chat.invoke(formattedChatPrompt)
console.log("Response  ::: ", response.content);