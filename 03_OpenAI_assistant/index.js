import dotenv from 'dotenv';
import { OpenAIAssistantRunnable } from "langchain/experimental/openai_assistant";
dotenv.config();


// const assistant = await OpenAIAssistantRunnable.createAssistant({
//     clientOptions: {apiKey: process.env.OPENAI_API_KEY}
//     model: "gpt-4-1106-preview",
//   });

const assistant = new OpenAIAssistantRunnable({
    assistantId: "asst_adlb27nNbnm8IrCMDa8vzp6Y",
    // asAgent: true
})
  const assistantResponse = await assistant.invoke({
    content: "What is google?",
  });
  console.log(assistantResponse);
  console.log("content:  ", assistantResponse[0].content);




