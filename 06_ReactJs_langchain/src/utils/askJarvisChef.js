import dotenv from 'dotenv';
dotenv.config()

import {ChatOpenAI} from '@langchain/openai'
import {ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate} from "@langchain/core/prompts";


export const askJarvisChef = async (recipeMessage)=> {
    // console.log(inputValue);
    const SECRET_KEY = process.OPENAI_API_KEY;
    const chat = new ChatOpenAI({openAIApiKey: SECRET_KEY});
    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate("Your name is Jarvis. You are a master chef so first introduce yourself as Jarvis The Master Chef. You can write any type of food recipe which can be cooked in 5 minutes. You are only allowed to answe food related queries. If you don't know the answer then tell I don't know the answer.")


    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate("{asked_recipe}");

    const chatPrompt = ChatPromptTemplate.fromMessages([
        systemMessagePrompt, humanMessagePrompt
    ])
    const formattedChatPrompt = await chatPrompt.formatMessages({
        asked_recipe : recipeMessage
    })
    const response = await chat.invoke(formattedChatPrompt);
    return response.content;
}

