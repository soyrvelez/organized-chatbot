import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}

// GET route to fetch chats
export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");

  try {
    if (chatId) {
      // Fetch a single chat by ID
      const chatData = await kv.hgetall(`chat:${chatId}`);
      if (!chatData || Object.keys(chatData).length === 0) {
        return new Response("Chat not found", { status: 404 });
      }
      return new Response(JSON.stringify(chatData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (userId) {
      // Fetch all chats for a given user ID
      const chatIds = await kv.zrange(`user:chat:${userId}`, 0, -1);
      const chats = [];
      for (const chatId of chatIds) {
        // Type assertion for chatId
        const chatData = await kv.hgetall(chatId as string);
        chats.push(chatData);
      }
      return new Response(JSON.stringify(chats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response("Chat ID or User ID is required", { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response("An unknown error occurred", {
        status: 500
      });
    }
  }
}
