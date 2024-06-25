import dotenv from 'dotenv';
dotenv.config()

import { traceable } from "langsmith/traceable";
import OpenAI from "openai";
import { wrapOpenAI } from "langsmith/wrappers";
import { Client } from "langsmith";
const langS = new Client();
const client = wrapOpenAI(new OpenAI({
  model: "gpt-4o"
}));
// const openai = new OpenAI();

// const formatPrompt = traceable(
//   (subject) => {
//     return [
//       {
//         role: "system" ,
//         content: "You are a helpful assistant.",
//       },
//       {
//         role: "user" ,
//         content: `What's a good name for a store that sells ${subject}?`,
//       },
//     ];
//   },
//   { name: "formatPrompt" }
// );

// const invokeLLM = traceable(
//   async ({ messages }) => {
//     return openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: messages,
//       temperature: 0,
//     });
//   },
//   { run_type: "llm", name: "invokeLLM" }
// );

// const parseOutput = traceable(
//   (response) => {
//     return response.choices[0].message.content;
//   },
//   { name: "parseOutput" }
// );

// const runPipeline = traceable(
//   async () => {
//     const messages = await formatPrompt("colorful socks");
//     const response = await invokeLLM({ messages });
//     return parseOutput(response);
//   },
//   { name: "runPipeline" }
// );

// const response = await runPipeline();

// console.log("response: ", response);


const myTool = traceable(
  async (question) => {
    return "During this morning's meeting, we couldn't solved all world conflict.";
  },
  { name: "Retrieve Context", run_type: "tool" }
);

const chatPipeline = traceable(
  async (question) => {
    const context = await myTool(question);
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant. Please respond to the user's request only based on the given context.",
      },
      { role: "user", content: `Question: ${question} Context: ${context}` },
    ];
    const chatCompletion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });
    return chatCompletion.choices[0].message.content;
  },
  { name: "Chat Pipeline" }
);

const response2 = await chatPipeline("Can you summarize this morning's meetings?");
console.log("response2:  ",response2);





const datasetName = "Dataset through code3";
// Filter runs to add to the dataset
const runs = [];
for await (const run of langS.listRuns({
  projectName: "Setup 1",
  isRoot: 1,
  error: false,
})) {
  runs.push(run);
}

const dataset = await langS.createDataset(datasetName, {
  description: "An example dataset programically",
  dataType: "kv",
});

for (const run of runs) {
  await langS.createExample(run.inputs, run.outputs ?? {}, {
    datasetId: dataset.id,
  });
  // console.log("run example:   ", run);
}