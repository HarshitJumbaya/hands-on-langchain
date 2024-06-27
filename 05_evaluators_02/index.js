import dotenv from 'dotenv';
dotenv.config()
import { OpenAI } from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";
import { evaluate } from "langsmith/evaluation";
// import { stringEvaluator } from "langsmith/evaluation";
import { StringEvaluator } from "langsmith/evaluation";
import {Client} from "langsmith"
import { PromptTemplate } from "@langchain/core/prompts";
const client = new Client();

// create a dataset
const questionsdocs = [
  ["What is LangChain?", "LangChain is a blockchain-based language service platform."],
  ["What is LangSmith?", "A platform for observing and evaluating LLM applications"],
  ["What is OpenAI?", "OpenAI is a socks brand."],
  ["What is Google?", "A technology company known for search"],
  ["What is Mistral?", "A company that creates Large Language Models"],
];

const [inputs, outputs] = questionsdocs.reduce(
  ([inputs, outputs], item) => [
    [...inputs, { input: item[0] }],
    [...outputs, { output: item[1] }],
  ],
  [[], []]
);

const datasetName = "Evaluate 9.1";
// const questionsDataset = await client.createDataset(datasetName);
// await client.createExamples({ inputs, outputs, datasetId: questionsDataset.id });




const PROMPT_TEMPLATE = `You are an expert professor specialized in grading students' answers to questions.
You are grading the following question and checking if the given answer matches or is somewhat relevant to the real answer:
{query}
Here is the real answer:
{answer}
You are grading the following predicted answer:
{result}
Respond with CORRECT or INCORRECT:
`
const prompt  = new PromptTemplate({
    inputVariables:["query", "answer", "result"], 
    template: PROMPT_TEMPLATE
}
)
const llm = wrapOpenAI(new OpenAI())

// const qa_evaluator = new StringEvaluator("Q/A", {llm, prompt})

// Define the grading function
const gradingFunction = async (params) => {
  console.log("PARAMS :::  ", params);
  const { input: query, prediction: result, answer } = params;

  console.log("Query:", query);
  console.log("Prediction (Result):", result);
  console.log("Answer:", answer);

  const response = await llm.chat.completions.create({
      messages: [
          { role: "system", content: PROMPT_TEMPLATE },
          { role: "user", content: `Query: ${query}\nAnswer: ${answer}\nResult: ${result}` },
      ],
      model: "gpt-4",
      temperature: 0.6,
  });

  const grade = response.choices[0].message.content.trim();
  console.log("response ::   ", response.choices[0]);
  return { score: grade === "CORRECT" ? 1 : 0, value: grade === "CORRECT" ? 1 : 0 };
};

class LangChainStringEvaluator extends StringEvaluator {
  constructor(name, config) {
      console.log("we are here in constructor");
      super({
          evaluationName: name,
          inputKey: "input",
          predictionKey: "outputs",
          answerKey: "output",
          gradingFunction: config.gradingFunction,
      });
      this.config = config;
      this.gradingFunction = config.gradingFunction; // Ensure this is set correctly
  }
}
const qa_evaluator = new LangChainStringEvaluator("Q/A", {
  gradingFunction,
  prompt,
});
const evaluateLength = (run, example)=> {
  // console.log("Run:::  ", run.outputs.outputs);
  // console.log("Example:::  ", example);
  const prediction = run.outputs?.outputs ?? "";
  const required = example.outputs?.output ?? "";   // created example in db
  const score = Number(required.length / prediction.length);
  // console.log("maths  ::  ", score);
  // console.log("prediction length ::: " ,prediction.length);
  // console.log("required length  :::",  required.length);
  return { key: "length", score };
}



 const myApp= traceable(
  async(question) => {
  const request = await llm.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Respond to the users question in a short, concise manner (one short sentence)."
            },
            {
                role : "user",
                content: question,
            }
    ],
    model: "gpt-4",
    temperature : 0.6
  });
  return request.choices[0].message.content;
  },
{name: "gpt-4"}
);


// function langsmithApp(questionsdocs){
//   const output = myApp(questionsdocs["input"]);
//   return {output: output};
// }

    

    await evaluate((inputs) => myApp(inputs["input"]), {
      data: datasetName,
  evaluators: [ evaluateLength, qa_evaluator],
  experimentPrefix: "gpt-4",
    });
        