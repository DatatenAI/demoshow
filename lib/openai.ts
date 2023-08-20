import {Configuration, OpenAIApi} from 'openai';
import prisma from "@/lib/database";


const getApi = async () => {
    const apiKey = await prisma.apiKey.findFirst({
        where: {
            alive: true,
        },
        orderBy: {
            used: 'asc',
        }
    });
    if (!apiKey) {
        throw new Error("不存在有效KEY");
    }
    return new OpenAIApi(new Configuration({
        apiKey: apiKey.key,
    }));
};

export const queryEmbedding = async (input: string) => {
    const api = await getApi();
    const response = await api.createEmbedding({
        model: "text-embedding-ada-002",
        input
    });
    return response.data.data[0].embedding;
}

const query: (prompt: string, content: string) => Promise<string | null> = async (prompt, content) => {
    const api = await getApi();
    const res = await api.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        temperature: 0.1,
        top_p: 0.95,
        messages: [
            {
                role: 'system',
                content: prompt
            },
            {
                role: 'user',
                content
            }
        ]
    });
    return res.data.choices[0].message?.content || null;
}

export const queryForSummaryChat = async (language: string, basicInfo: string, question: string, searchResult: string) => {
    const prompt = `You are a research scientist and you are skilled reply the query with given information using concise and academic language`;
    const content = `
     This Paper basic information:
     ${basicInfo}
     Here is information related to the query in the paper: 
     ${query}
     Search Result:
     ${searchResult}
     Remember:
      - Please accurately answer the user's question based on the Search Result and their needs.
      - If the Search Result is None,Reply:I can't find the answer to your question.
      - Retain proper nouns in English, maintaining proper academic language.
      - keep the paper title in original English format. Make sure output as ${language}.
     `
    return await query(prompt, content);
}

export const queryForSearchChat = async (language: string, question: string, searchResult: string) => {
    const prompt = `You are a research scientist proficient in answering queries using succinct and academic language. Your task is to respond to user queries based on results from a vector database search. The content primarily includes a summary of the search results and metadata about the paper. In your reply, retain proper nouns in English while maintaining appropriate academic language. Give a output language as ${language}, but keep the paper title in its original English format.`;
    const content = `
        Here is the search result according to the query: 
        Query:
        ${question}
        Result:
        ${searchResult}
        - Please note, this reply will maintain suitable academic language and retain proper nouns in English. 
        -  Give a output language as ${language}
        - keep the paper title in original English format.
     `
    return await query(prompt, content);
}

