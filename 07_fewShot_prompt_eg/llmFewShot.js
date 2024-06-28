import dotenv from 'dotenv';
dotenv.config()
import {OpenAI} from  "@langchain/openai"
import {PromptTemplate, FewShotPromptTemplate} from "@langchain/core/prompts"


const llm = new OpenAI({})


const examples = [
  {
    "input" : "The patient presented with acute exacerbation of chronic obstructive pulmonary diease, manifesting symptoms such as dyspnea, increased respiratory rate , and the use of accessory muscles for breathing.",
    "output": "The patient is having a sudden worsening of chronic lung disease. This shows with diffuculty breathing, faster breathing, and using extra muscles to breathe."
  }
]

const examplePrompt =  new PromptTemplate({
  inputVariables: ["input", "output"],
  template: "{input} {output}"
})

const prompt = new FewShotPromptTemplate({
  examples, 
  examplePrompt,
  suffix: "{myinput}",
  inputVariables: ["myinput"]
})

const myprompt = await prompt.format({
  myinput: "The patient has been diagnosed with hypertension, evidenced by consistently elevated blood pressure readings, indicating sustained systolica and diastolic pressures above the normal range."
})

const response = await llm.invoke(myprompt);
console.log(response);