import dotenv from 'dotenv';
dotenv.config()

import { OpenAI } from "openai";
import { wrapOpenAI } from "langsmith/wrappers";
import { traceable } from "langsmith/traceable";
import { Client } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const langsmith = new Client();
const client = wrapOpenAI(new OpenAI());

// Step 1: Define your target task
const labelText = traceable(
  async (text) => {
    const result = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Please review the user query below and determine if it contains any form of toxic behavior, such as insults, threats, or highly negative comments. Respond with 'Toxic' if it does, and 'Not toxic' if it doesn't.",
        },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    return result.choices[0].message.content;
  },
  { name: "labelText" }
);


// Step 2: Create or select a dataset


// create a dataset
const toxicExamples = [
  ["Shut up, idiot", "Toxic"],
  ["You're a wonderful person", "Not toxic"],
  ["This is the worst thing ever", "Toxic"],
  ["I had a great day today", "Not toxic"],
  ["Nobody likes you", "Toxic"],
  ["This is unacceptable. I want to speak to the manager.", "Not toxic"],
];

const [inputs, outputs] = toxicExamples.reduce(
  ([inputs, outputs], item) => [
    [...inputs, { input: item[0] }],
    [...outputs, { outputs: item[1] }],
  ],
  [[], []]
);

const datasetName = "Toxic Queries";
// const toxicDataset = await langsmith.createDataset(datasetName);
// await langsmith.createExamples({ inputs, outputs, datasetId: toxicDataset.id });


// Step 3. Configure evaluators to score the outputs

// Row-level evaluator
function correctLabel(rootRun, example) {
  const score = rootRun.outputs?.outputs === example.outputs?.output;
  return { key: "correct_label", score };
}

// Step 4. Run the evaluation and view the results

// At its simplest, the evaluate method takes the following arguments:
// a function that takes an input dictionary or object and returns an output dictionary or object
// data - the name OR UUID of the LangSmith dataset to evaluate on, or an iterator of examples
// evaluators - a list of evaluators to score the outputs of the function
// experiment_prefix - a string to prefix the experiment name with. A name will be generated if not provided.


// The function calls labelText with inputs["input"] as the argument.
// inputs["input"] accesses the property input from the inputs object.
await evaluate((inputs) => labelText(inputs["input"]), {
  data: datasetName,
  evaluators: [correctLabel],
  experimentPrefix: "Toxic Queries",
});

//  Evaluate on a particular version of a dataset
await evaluate((inputs) => labelText(inputs["input"]), {
  data: langsmith.listExamples({
    datasetName: datasetName,
    asOf: "latest",
  }),
  evaluators: [correctLabel],
  experimentPrefix: "Toxic Queries",
});


// Use summary evaluators
function summaryEval(runs, examples) {
  let correct = 0;

  for (let i = 0; i < runs.length; i++) {
    if (runs[i].outputs["output"] === examples[i].outputs["label"]) {
      correct += 1;
    }
  }

  return { key: "pass", score: correct / runs.length > 0.5 };
}

await evaluate((inputs) => labelText(inputs["input"]), {
  data: datasetName,
  evaluators: [correctLabel],
  summaryEvaluators: [summaryEval],
  experimentPrefix: "Toxic Queries",
});



const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Please review the user query below and determine if it contains any form of toxic behavior, such as insults, threats, or highly negative comments. Respond with 'Toxic' if it does, and 'Not toxic' if it doesn't.",
  ],
  ["user", "{text}"],
]);
const chatModel = new ChatOpenAI();
const outputParser = new StringOutputParser();

const formatChat = await prompt.format({
  text: "You are a beautiful creature."
})
// const chain = prompt.pipe(chatModel).pipe(outputParser);
const response = await chatModel.invoke(formatChat);
const response2 = await outputParser.invoke(response);
// console.log("chain:  " , chain);
console.log("response 2:  ", response2);
console.log("hello  ");

await evaluate(response2, {
  data: datasetName,
  evaluators: [correctLabel],
  experimentPrefix: "Toxic Queries",
});