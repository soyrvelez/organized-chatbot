import { kv } from '@vercel/kv'

export const runtime = 'edge'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

// GET route to fetch all messages for a given chat ID
export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");

  if (!chatId) {
    return new Response("Chat ID is required", { status: 400 });
  }

  try {
    const chatData = await kv.hgetall(`chat:${chatId}`);
    if (!chatData || Object.keys(chatData).length === 0) {
      return new Response("Chat not found", { status: 404 });
    }

    const chat: Chat = chatData as unknown as Chat;

    return new Response(JSON.stringify(chat.messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
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
